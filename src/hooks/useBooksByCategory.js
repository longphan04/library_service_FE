// ==========================================
// Custom Hook: useBooksByCategory
// Mô tả: Hook quản lý việc fetch sách theo category với:
//   - Race Condition handling (cleanup)
//   - Caching (không gọi lại API nếu đã có dữ liệu)
//   - Data normalization (chuẩn hóa book data)
//   - Loading/Error state management
//
// Vị trí: src/hooks/useBooksByCategory.js
// ==========================================

import { useState, useRef, useCallback } from 'react';
import bookService from '../services/book.service';
import { getBookCoverUrl } from '../utils/imageUrl';

// ==========================================
// Helper: Normalize Book Data
// Chuẩn hóa các field khác nhau từ API (book_id, id, _id, etc.)
// ==========================================
const normalizeBook = (book) => ({
    id: book.book_id || book.id || book._id,
    _id: book.book_id || book._id || book.id,
    title: book.title || 'Không có tiêu đề',
    author: book.authors?.[0]?.name
        || book.author?.name
        || book.authorName
        || book.author
        || 'Không rõ tác giả',
    coverImage: getBookCoverUrl(
        book.cover_url || book.coverImage || book.image || book.thumbnail
    ),
});

// ==========================================
// Custom Hook: useBooksByCategory
// ==========================================
const useBooksByCategory = (limit = 6) => {
    // ==========================================
    // State Management
    // ==========================================

    /** Sách của category đang chọn */
    const [books, setBooks] = useState([]);

    /** Trạng thái loading */
    const [loading, setLoading] = useState(false);

    /** Thông báo lỗi (nếu có) */
    const [error, setError] = useState(null);

    /** Category ID đang được chọn */
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // ==========================================
    // Cache & Race Condition Prevention
    // ==========================================

    /** 
     * Cache lưu trữ kết quả API đã fetch
     * Key: categoryId, Value: normalized books array
     */
    const cacheRef = useRef(new Map());

    /**
     * Abort Controller để cancel request khi user click nhanh
     * Giải quyết Race Condition
     */
    const abortControllerRef = useRef(null);

    // ==========================================
    // Fetch Books by Category
    // ==========================================

    /**
     * Fetch sách theo category ID
     * - Kiểm tra cache trước khi gọi API
     * - Xử lý Race Condition với AbortController
     * - Normalize dữ liệu sau khi nhận response
     * 
     * @param {string} categoryId - ID của category cần fetch
     */
    const fetchBooks = useCallback(async (categoryId) => {
        // Validate input
        if (!categoryId) {
            setBooks([]);
            setSelectedCategoryId(null);
            return;
        }

        // Update selected category
        setSelectedCategoryId(categoryId);

        // ========== CHECK CACHE ==========
        const cachedBooks = cacheRef.current.get(categoryId);
        if (cachedBooks) {
            // DEBUG: Log cache hit
            console.log('[useBooksByCategory] ✅ CACHE HIT for category:', categoryId, '- Books:', cachedBooks);

            // Có trong cache → sử dụng ngay, không cần gọi API
            setBooks(cachedBooks);
            setLoading(false);
            setError(null);
            return;
        }

        // DEBUG: Log cache miss
        console.log('[useBooksByCategory] ❌ CACHE MISS for category:', categoryId, '- Will fetch from API');

        // ========== RACE CONDITION HANDLING ==========
        // Cancel request trước đó (nếu đang pending)
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Tạo AbortController mới cho request này
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        // ========== FETCH DATA ==========
        setLoading(true);
        setError(null);

        try {
            // DEBUG: Log API call
            console.log('[useBooksByCategory] 🔍 Fetching books for category:', categoryId);

            // Gọi API: GET /book?category={categoryId}&limit={limit}
            const response = await bookService.getAll({
                category: categoryId,
                limit
            });

            // DEBUG: Log raw response
            console.log('[useBooksByCategory] 📥 API Response:', response);

            // Kiểm tra xem request có bị abort không
            if (signal.aborted) {
                return; // Bỏ qua nếu đã bị cancel
            }

            // Extract books từ response
            const rawBooks = Array.isArray(response)
                ? response
                : response.data || [];

            // Normalize tất cả books
            const normalizedBooks = rawBooks.map(normalizeBook);

            // Lưu vào cache
            cacheRef.current.set(categoryId, normalizedBooks);

            // Update state
            setBooks(normalizedBooks);
            setError(null);

        } catch (err) {
            // Bỏ qua lỗi nếu là do abort (user click nhanh)
            if (err.name === 'AbortError' || signal.aborted) {
                return;
            }

            console.error('[useBooksByCategory] Lỗi khi fetch sách:', err);
            setBooks([]);
            setError(err.message || 'Không thể tải sách. Vui lòng thử lại.');

        } finally {
            // Chỉ update loading nếu không bị abort
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, [limit]);

    // ==========================================
    // Clear Selection
    // ==========================================

    /**
     * Reset state về trạng thái ban đầu
     */
    const clearSelection = useCallback(() => {
        setBooks([]);
        setSelectedCategoryId(null);
        setError(null);
        setLoading(false);
    }, []);

    // ==========================================
    // Clear Cache (optional utility)
    // ==========================================

    /**
     * Xóa cache (dùng khi cần refresh data)
     * @param {string} categoryId - ID category cần xóa, hoặc undefined để xóa tất cả
     */
    const clearCache = useCallback((categoryId) => {
        if (categoryId) {
            cacheRef.current.delete(categoryId);
        } else {
            cacheRef.current.clear();
        }
    }, []);

    // ==========================================
    // Return Hook Interface
    // ==========================================
    return {
        // State
        books,
        loading,
        error,
        selectedCategoryId,

        // Actions
        fetchBooks,
        clearSelection,
        clearCache,

        // Utilities
        normalizeBook, // Export để component khác có thể dùng
    };
};

export default useBooksByCategory;

// Export helper riêng nếu cần dùng ở nơi khác
export { normalizeBook };
