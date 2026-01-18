// ==========================================
// Hook: useBookHold
// Mô tả: Custom hook để quản lý book holds (đặt trước sách)
// Hỗ trợ: fetch, create, remove với optimistic update, borrow all
// Performance: O(1) lookups với Map, normalized data
// ==========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import bookHoldService from '../services/book-hold.service';
import { createBorrowRequest } from '../services/borrow-ticket.service';

// ==========================================
// Data Normalization Helper
// Tách logic biến đổi dữ liệu ra ngoài hook
// ==========================================

/**
 * Chuẩn hóa dữ liệu hold từ API về format nhất quán
 * @param {Object} hold - Raw hold data from API
 * @returns {Object} - Normalized hold object
 */
const normalizeHoldData = (hold) => {
    // Extract book data with fallbacks
    const rawBook = hold.book || {};

    // Normalize book ID - check all possible field names
    const bookId = hold.book_id
        || hold.bookId
        || rawBook.book_id
        || rawBook.id
        || rawBook._id
        || null;

    // Normalize hold ID
    const holdId = hold.hold_id || hold.id || hold._id || null;

    // Normalize book info
    const book = {
        id: bookId,
        title: rawBook.title || 'Không rõ',
        author: rawBook.authors?.[0]?.name
            || rawBook.author?.name
            || rawBook.authorName
            || 'Không rõ',
        coverImage: rawBook.cover_url
            || rawBook.coverImage
            || rawBook.image
            || null,
        availableCopies: rawBook.available_copies
            || rawBook.availableCopies
            || 0,
    };

    return {
        id: holdId,
        holdId,
        bookId,
        book,
        status: hold.status || 'ACTIVE',
        createdAt: hold.created_at || hold.createdAt || null,
    };
};

/**
 * Chuẩn hóa mảng holds
 * @param {Array} holds - Raw holds array from API
 * @returns {Array} - Normalized holds array
 */
const normalizeHoldsArray = (data) => {
    const rawArray = Array.isArray(data) ? data : data?.data || [];
    return rawArray.map(normalizeHoldData);
};

// ==========================================
// useBookHold Hook
// ==========================================

const useBookHold = () => {
    const [holds, setHolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // ==========================================
    // Performance: Map cho O(1) lookups
    // ==========================================

    /**
     * Map: bookId -> hold object
     * Cho phép lookup O(1) thay vì O(N)
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
     * Set: bookIds đang được hold
     * Cho phép check O(1)
     */
    const heldBookIds = useMemo(() => {
        return new Set(holds.map((hold) => hold.bookId).filter(Boolean));
    }, [holds]);

    // ==========================================
    // Fetch Holds từ API
    // ==========================================

    const fetchHolds = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await bookHoldService.getMyHolds();
            const normalizedHolds = normalizeHoldsArray(response);
            setHolds(normalizedHolds);
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách sách đang giữ');
            setHolds([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchHolds();
    }, [fetchHolds]);

    // ==========================================
    // Create Hold - Optimistic local update
    // ==========================================

    const createHold = useCallback(async (data) => {
        setActionLoading(true);
        setError(null);

        try {
            const response = await bookHoldService.create(data);

            // Normalize response và thêm vào state local
            const newHold = normalizeHoldData(response);

            setHolds((prev) => {
                // Kiểm tra duplicate trước khi thêm
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
    // Remove Hold - Optimistic Update
    // ==========================================

    const removeHold = useCallback(async (id) => {
        setActionLoading(true);
        setError(null);

        // Debug: Log ID được gửi đi
        console.log('🗑️ Attempting to remove hold with ID:', id);
        console.log('📋 Current holds:', holds.map(h => ({ id: h.id, holdId: h.holdId, bookId: h.bookId })));

        // Lưu state cũ để rollback
        const previousHolds = holds;

        // Optimistic: xóa khỏi UI ngay
        setHolds((prev) => prev.filter((hold) =>
            hold.id !== id && hold.holdId !== id
        ));

        try {
            await bookHoldService.remove(id);
            console.log('✅ Thêm vào kệ sách thành công');
            // Success - không cần làm gì thêm
        } catch (err) {
            console.error('❌ Xóa sách thành công', err.response?.data || err.message);
            // Rollback on error
            setHolds(previousHolds);
            setError(err.message || 'Không thể xóa sách khỏi kệ');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [holds]);

    // ==========================================
    // Borrow All Holds
    // ==========================================

    const borrowAllHolds = useCallback(async () => {
        if (holds.length === 0) {
            throw new Error('Kệ sách trống, không có sách để mượn');
        }

        setActionLoading(true);
        setError(null);

        try {
            const holdIds = holds.map((hold) => hold.id || hold.holdId);
            const result = await createBorrowRequest(holdIds);

            // Clear kệ sách sau khi mượn thành công
            setHolds([]);

            return result;
        } catch (err) {
            setError(err.message || 'Không thể mượn sách');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [holds]);

    // ==========================================
    // Lookup Functions - O(1) với Map/Set
    // ==========================================

    /**
     * Kiểm tra sách đã được hold chưa - O(1)
     */
    const isBookOnHold = useCallback((bookId) => {
        return heldBookIds.has(bookId);
    }, [heldBookIds]);

    /**
     * Lấy hold theo bookId - O(1)
     */
    const getHoldByBookId = useCallback((bookId) => {
        return holdsByBookId.get(bookId) || null;
    }, [holdsByBookId]);

    // ==========================================
    // Clear All (local only)
    // ==========================================

    const clearAllHolds = useCallback(() => {
        setHolds([]);
    }, []);

    // ==========================================
    // Return
    // ==========================================

    return {
        // State
        holds,
        loading,
        error,
        actionLoading,

        // Actions
        createHold,
        removeHold,
        borrowAllHolds,
        clearAllHolds,
        refetch: fetchHolds,

        // Lookups (O(1))
        isBookOnHold,
        getHoldByBookId,

        // Derived data
        holdCount: holds.length,
        isEmpty: holds.length === 0,
    };
};

export default useBookHold;
