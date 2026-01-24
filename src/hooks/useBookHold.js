// ==========================================
// Hook: useBookHold
// Mô tả: Custom hook để quản lý việc giữ sách (book holds) trong hệ thống
// Hỗ trợ: Tải dữ liệu, tạo mới, xóa (với cập nhật giao diện nhanh - optimistic update), mượn sách
// Vị trí: src/hooks/useBookHold.js
// ==========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import bookHoldService from '../services/book-hold.service';
import { createBorrowRequest } from '../services/borrow-ticket.service';
import { getBookCoverUrl } from '../utils/imageUrl';

// ==========================================
// Hàm hỗ trợ chuẩn hóa dữ liệu (Data Normalization)
// ==========================================

/**
 * Chuẩn hóa dữ liệu hold từ API về định dạng nhất quán cho UI
 * @param {Object} hold - Dữ liệu thô từ API (Dựa trên endpoint /book-hold/me)
 * @returns {Object} - Đối tượng hold đã được chuẩn hóa
 */
const normalizeHoldData = (hold) => {
    // Trích xuất dữ liệu sách (thường nằm trong object lồng 'book')
    const rawBook = hold.book || hold.Book || {};

    // Chuẩn hóa ID sách - Ưu tiên book_id/id từ backend
    const bookId = hold.book_id
        || rawBook.book_id
        || hold.bookId
        || rawBook.id
        || rawBook._id
        || null;

    // Chuẩn hóa ID của bản ghi giữ sách (hold ID)
    const holdId = hold.hold_id || hold.id || hold._id || null;

    // Chuẩn hóa thông tin chi tiết của sách để hiển thị trên UI
    const book = {
        id: bookId,
        title: rawBook.title || 'Không rõ',
        // Tác giả có thể là mảng 'authors' hoặc field 'author'
        author: rawBook.authors?.[0]?.name
            || rawBook.author?.name
            || rawBook.authorName
            || 'Không rõ',
        // Ảnh bìa ưu tiên 'cover_url' theo chuẩn book.service.js
        coverImage: getBookCoverUrl(
            rawBook.cover_url
            || rawBook.coverImage
            || rawBook.image
            || rawBook.thumbnail
        ),
        // Số lượng bản sao có sẵn
        availableCopies: rawBook.available_copies
            || rawBook.availableCopies
            || rawBook.available
            || 0,
    };

    return {
        id: holdId,           // ID định danh duy nhất cho bản ghi hold
        holdId,               // Alias
        bookId,               // ID sách được giữ
        book,                 // Thông tin sách chi tiết
        status: hold.status || 'ACTIVE',
        // Thời gian tạo - Quan trọng cho bộ đếm ngược 10 phút
        createdAt: hold.created_at || hold.createdAt || hold.createdAtDate || null,
    };
};

/**
 * Chuẩn hóa mảng bộ sưu tập các bản ghi giữ sách
 * Xử lý cả trường hợp API trả về mảng trực tiếp hoặc đóng gói trong { data: [] }
 * @param {Array|Object} data - Dữ liệu thô từ API
 * @returns {Array} - Mảng hold đã chuẩn hóa, sẵn sàng cho UI
 */
const normalizeHoldsArray = (data) => {
    const rawArray = Array.isArray(data) ? data : data?.data || [];
    return rawArray.map(normalizeHoldData);
};

// ==========================================
// Hook chính: useBookHold
// ==========================================

const useBookHold = () => {
    const [holds, setHolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // ==========================================
    // Hiệu năng: Sử dụng Map/Set để truy cập dữ liệu O(1)
    // ==========================================

    /**
     * Bản đồ tra cứu nhanh: bookId -> hold object
     */
    const holdsByBookId = useMemo(() => {
        const map = new Map();
        holds.forEach((hold) => {
            if (hold.bookId) {
                map.set(hold.bookId, hold);
            }
        });
        return map;
    }, [holds]);

    /**
     * Tập hợp các ID sách đang có trong kệ
     */
    const heldBookIds = useMemo(() => {
        return new Set(holds.map((hold) => hold.bookId).filter(Boolean));
    }, [holds]);

    // ==========================================
    // Fetch Holds: Kết nối API /book-hold/me
    // ==========================================

    const fetchHolds = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Gọi service kết nối đúng endpoint api/book-hold/me
            const response = await bookHoldService.getMyHolds();
            const normalizedHolds = normalizeHoldsArray(response);

            setHolds(normalizedHolds);
        } catch (err) {
            console.error('[useBookHold] API Error:', err);
            setError(err.message || 'Không thể tải danh sách sách đang giữ');
            setHolds([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Tự động tải dữ liệu khi sử dụng hook
    useEffect(() => {
        fetchHolds();
    }, [fetchHolds]);

    // ==========================================
    // Create Hold: Thêm sách vào kệ (POST /book-hold)
    // ==========================================

    const createHold = useCallback(async (data) => {
        setActionLoading(true);
        setError(null);

        try {
            const response = await bookHoldService.create(data);

            const newHold = normalizeHoldData(response);

            setHolds((prev) => {
                // Đảm bảo không thêm trùng lặp sách vào kệ
                const exists = prev.some((h) => h.bookId === newHold.bookId);
                if (exists) return prev;
                return [newHold, ...prev];
            });

            return newHold;
        } catch (err) {
            setError(err.message || 'Không thể đặt trước sách');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, []);

    // ==========================================
    // Remove Hold: Hủy giữ sách (DELETE /book-hold/:id)
    // ==========================================

    const removeHold = useCallback(async (id) => {
        setActionLoading(true);
        setError(null);

        // Lưu trạng thái hiện tại để phục hồi nếu API lỗi (Optimistic Update)
        const previousHolds = holds;

        // Xóa tạm thời khỏi giao diện để UX mượt mà
        setHolds((prev) => prev.filter((hold) =>
            hold.id !== id && hold.holdId !== id
        ));

        try {
            await bookHoldService.remove(id);
        } catch (err) {
            console.error('[useBookHold] Remove Error:', err);
            // Phục hồi lại danh sách nếu server không xử lý thành công
            setHolds(previousHolds);
            setError(err.message || 'Không thể xóa sách khỏi kệ');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [holds]);

    // ==========================================
    // Borrow: Tiến hành mượn sách đã chọn (tạo phiếu mượn)
    // ==========================================

    const borrowAllHolds = useCallback(async (selectedIds = null) => {
        // Lọc ra các bản ghi hold người dùng đã chọn (tối đa 5)
        const targetHolds = selectedIds
            ? holds.filter(h => selectedIds.includes(h.id) || selectedIds.includes(h.holdId))
            : holds;

        if (targetHolds.length === 0) {
            throw new Error('Chưa chọn sách để mượn');
        }

        setActionLoading(true);
        setError(null);

        try {
            const holdIds = targetHolds.map((hold) => hold.id || hold.holdId);
            const result = await createBorrowRequest(holdIds);

            // Xóa các sách đã mượn thành công ra khỏi kệ
            setHolds((prev) => prev.filter(h => !holdIds.includes(h.id) && !holdIds.includes(h.holdId)));

            return result;
        } catch (err) {
            setError(err.message || 'Không thể mượn sách');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [holds]);

    // ==========================================
    // Borrow Directly: Mượn ngay không qua Kệ sách
    // Quy trình: Tạo Hold -> Tạo Phiếu Mượn -> Thành công
    // ==========================================

    const borrowDirectly = useCallback(async (bookId) => {
        setActionLoading(true);
        setError(null);

        try {
            // 1. Kiểm tra xem sách đã có trong kệ chưa
            let hold = holdsByBookId.get(bookId);

            // 2. Nếu chưa có, tạo mới một hold
            if (!hold) {
                const response = await bookHoldService.create({ bookId });
                hold = normalizeHoldData(response);
                // Cập nhật state local
                setHolds(prev => [hold, ...prev]);
            }

            // 3. Tiến hành tạo Phiếu mượn cho sách này
            const holdId = hold.id || hold.holdId;
            const result = await createBorrowRequest([holdId]);

            // 4. Xóa khỏi kệ nếu mượn thành công
            setHolds(prev => prev.filter(h => h.id !== holdId && h.holdId !== holdId));

            return result;
        } catch (err) {
            setError(err.message || 'Mượn sách thất bại');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [holdsByBookId]);

    // ==========================================
    // Các hàm tra cứu nhanh và thao tác local
    // ==========================================

    const isBookOnHold = useCallback((bookId) => {
        return heldBookIds.has(bookId);
    }, [heldBookIds]);

    const getHoldByBookId = useCallback((bookId) => {
        return holdsByBookId.get(bookId) || null;
    }, [holdsByBookId]);

    const clearAllHolds = useCallback(() => {
        setHolds([]);
    }, []);

    // ==========================================
    // Kết quả trả về của Hook
    // ==========================================

    return {
        holds,                // Danh sách sách trong kệ (Đã chuẩn hóa)
        loading,              // Trạng thái đang tải từ API
        error,                // Lỗi kết nối (nếu có)
        actionLoading,        // Trạng thái đang xử lý hành động (thêm/xóa/mượn)

        createHold,           // Hàm thêm sách
        removeHold,           // Hàm xóa sách
        borrowAllHolds,       // Hàm gửi yêu cầu mượn (từ kệ)
        borrowDirectly,       // Hàm mượn ngay (trực tiếp)
        clearAllHolds,        // Xóa local
        refetch: fetchHolds,  // Hàm làm mới dữ liệu từ server

        isBookOnHold,         // Kiểm tra trạng thái O(1)
        getHoldByBookId,      // Lấy thông tin O(1)

        holdCount: holds.length, // Tổng số trong kệ
        isEmpty: holds.length === 0, // Kiểm tra kệ trống
    };
};

export default useBookHold;
