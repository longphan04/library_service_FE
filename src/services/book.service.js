// ==========================================
// Book Service
// Mô tả: Service layer xử lý các API liên quan đến sách
// 
// Các endpoint được hỗ trợ:
//   - GET /book                    - Lấy danh sách sách (có filter, search, sort, pagination)
//   - GET /book/:id                - Lấy chi tiết một cuốn sách
//   - GET /books/:bookId/copies    - Lấy danh sách bản sao của sách
//
// Query params hỗ trợ cho GET /book:
//   - category: ID danh mục để filter
//   - keyword: Từ khóa tìm kiếm (tên sách, tác giả)
//   - sort: Sắp xếp (title, -title, createdAt, -createdAt)
//   - page: Số trang (mặc định 1)
//   - limit: Số item mỗi trang (mặc định 12)
//
// Lưu ý:
//   - Sử dụng axios instance đã config sẵn (có interceptor xử lý token)
//   - Tự động xử lý 401 redirect về login
// ==========================================

import axios, { getToken } from './axios';

// ==========================================
// Caching System
// ==========================================

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const bookCache = new Map(); // Key: Identifier, Value: { data, timestamp }

const getFromCache = (key) => {
    if (!key) return null;
    const cacheKey = String(key);
    if (bookCache.has(cacheKey)) {
        const { data, timestamp } = bookCache.get(cacheKey);
        if (Date.now() - timestamp < CACHE_TTL) {
            // console.log(`[BookCache] Hit: ${cacheKey}`);
            return data;
        }
        bookCache.delete(cacheKey);
    }
    return null;
};

const setCache = (key, data) => {
    if (!key || !data) return;
    const cacheKey = String(key);
    const entry = { data, timestamp: Date.now() };

    bookCache.set(cacheKey, entry);
    // Also cache by other standard identifiers if available
    if (data.book_id && String(data.book_id) !== cacheKey) {
        bookCache.set(String(data.book_id), entry);
    }
    if (data.isbn && data.isbn !== cacheKey) {
        bookCache.set(data.isbn, entry);
    }
};

// ==========================================
// getAll - Lấy danh sách sách
// ==========================================

/**
 * Lấy danh sách sách với các tùy chọn filter, search, sort, pagination
 * Có sử dụng caching để tối ưu performance
 */
export const getAll = async (params = {}) => {
    // Lọc bỏ các params có giá trị undefined, null hoặc chuỗi rỗng
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});

    // Cache key dựa trên params
    const cacheKey = `getAll:${JSON.stringify(cleanParams)}`;

    // Check cache (trừ khi có yeu cầu force refresh - nhưng ở đây chưa implement params.forceRefresh)
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    // DEBUG: Log the actual params being sent
    // console.log('[bookService.getAll] 📤 Request params:', cleanParams);

    // Gọi API GET /book với các query params
    const response = await axios.get('/book', { params: cleanParams });

    // DEBUG: Log response
    // console.log('[bookService.getAll] 📥 Response:', response.data);

    // Save to cache
    setCache(cacheKey, response.data);

    // Cache individual books if possible (nếu response trả về list books)
    let booksList = [];
    if (Array.isArray(response.data)) {
        booksList = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
        booksList = response.data.data;
    } else if (response.data?.books && Array.isArray(response.data.books)) {
        booksList = response.data.books;
    }

    booksList.forEach(book => {
        if (book.book_id) setCache(book.book_id, book);
        if (book.isbn) setCache(book.isbn, book);
    });

    // Trả về data từ response
    return response.data;
};

// ==========================================
// getById - Lấy chi tiết sách theo ID
// ==========================================

/**
 * Lấy thông tin chi tiết của một cuốn sách theo ID
 * 
 * @param {string|number} id - ID của sách cần lấy
 * 
 * @returns {Promise<Object>} Thông tin chi tiết sách:
 *   - book_id: ID sách
 *   - title: Tên sách
 *   - authors: Danh sách tác giả
 *   - categories: Danh sách danh mục
 *   - cover_url: URL ảnh bìa
 *   - description: Mô tả
 *   - publish_year: Năm xuất bản
 *   - available_copies: Số bản có sẵn
 *   - total_copies: Tổng số bản
 * 
 * @example
 * const book = await bookService.getById('abc123');
 * console.log(book.title); // "Lịch sử Việt Nam"
 */
export const getById = async (id) => {
    // IMPORTANT: Do NOT use cache for getById
    // Cache may contain incomplete data from list pages (missing description, publish_year, etc.)
    // Always fetch fresh data from API for detail pages

    // Gọi API GET /book/:id
    const response = await axios.get(`/book/${id}`);

    // Update cache with complete data for future use
    setCache(id, response.data);

    return response.data;
};

// ==========================================
// getByIsbn - Lấy chi tiết sách theo ISBN
// ==========================================

/**
 * Lấy thông tin chi tiết của một cuốn sách theo ISBN
 * Sử dụng cho tính năng tìm kiếm sách từ AI response (thường trả về ISBN)
 * 
 * @param {string} isbn - ISBN của sách cần lấy
 * 
 * @returns {Promise<Object>} Thông tin chi tiết sách
 * 
 * @example
 * const book = await bookService.getByIsbn('9781794217010');
 */
export const getByIsbn = async (isbn) => {
    // Check cache first
    const cached = getFromCache(isbn);
    if (cached) return cached;

    // Gọi API GET /book?isbn=xxx (search theo ISBN)
    const response = await axios.get('/book', { params: { isbn } });

    let bookData = null;

    // API trả về mảng books, lấy cái đầu tiên nếu có
    if (response.data && Array.isArray(response.data)) {
        if (response.data.length > 0) {
            bookData = response.data[0];
        }
    }
    // Hoặc nếu API trả về object với data field
    else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        if (response.data.data.length > 0) {
            bookData = response.data.data[0];
        }
    } else {
        bookData = response.data;
    }

    if (bookData) {
        setCache(isbn, bookData);
        return bookData;
    }

    throw new Error(`Book not found with ISBN: ${isbn}`);
};

// ==========================================
// getBooksByIdentifiers - Batch fetch sách
// ==========================================

/**
 * Lấy danh sách sách từ danh sách identifiers (ISBN hoặc ID)
 * Có sử dụng caching để giảm số request
 * 
 * @param {Array<string>} ids - Danh sách ISBN/ID
 * @returns {Promise<Array>} Danh sách sách chi tiết
 */
export const getBooksByIdentifiers = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const uniqueIds = [...new Set(ids)];
    const result = [];
    const missingIds = [];

    // 1. Check cache first
    uniqueIds.forEach(id => {
        const cached = getFromCache(id);
        if (cached) {
            result.push(cached);
        } else {
            missingIds.push(id);
        }
    });

    // 2. Fetch missing items if any
    if (missingIds.length > 0) {
        try {
            // console.log(`[BookService] Batch fetching ${missingIds.length} items`);
            const response = await axios.post('/book/identifier', { ids: missingIds });

            let fetchedBooks = [];
            if (Array.isArray(response.data)) {
                fetchedBooks = response.data;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                fetchedBooks = response.data.data;
            }

            // 3. Update cache
            fetchedBooks.forEach(book => {
                // Determine primary key (ID) and secondary key (ISBN)
                if (book.book_id) setCache(book.book_id, book);
                if (book.isbn) setCache(book.isbn, book);

                result.push(book);
            });
        } catch (error) {
            console.error('[BookService] Batch fetch error:', error);
            // Fallback: try individual fetch if batch fails? 
            // Or just return what we currently have + error propagation?
            // For now, return what we have to not break UI completely
        }
    }

    return result;
};

// ==========================================
// getBookCopies - Lấy danh sách bản sao của sách
// ==========================================

/**
 * Lấy danh sách các bản sao (copies) của một cuốn sách
 * Sử dụng cho tính năng chọn phiên bản/bản lưu trong BookDetail
 * 
 * @param {string|number} bookId - ID của sách
 * 
 * @returns {Promise<Array>} Mảng các bản sao:
 *   - copy_id: ID bản sao
 *   - status: Trạng thái (available/borrowed)
 *   - year: Năm xuất bản của bản này
 *   - condition: Tình trạng sách
 * 
 * @example
 * const copies = await bookService.getBookCopies('abc123');
 * const availableCopies = copies.filter(c => c.status === 'available');
 */
export const getBookCopies = async (bookId) => {
    // Gọi API GET /books/:bookId/copies
    const response = await axios.get(`/books/${bookId}/copies`);
    return response.data;
};

// ==========================================
// getRecentBooks - Lấy danh sách sách mới thêm
// ==========================================

/**
 * Lấy danh sách sách mới được thêm vào thư viện
 * Endpoint: GET /recent-books
 * 
 * @returns {Promise<Array>} Danh sách sách mới
 */
/**
 * Lấy danh sách sách mới được thêm vào thư viện
 * Endpoint: GET /dashboard/recent-books
 * 
 * @returns {Promise<Array>} Danh sách sách mới
 */
export const getRecentBooks = async () => {
    try {
        const response = await axios.get('/dashboard/recent-books');
        return response.data;
    } catch (error) {
        console.warn("API /dashboard/recent-books failed, using mock data", error);
        return [
            { book_id: 101, title: "Dế Mèn Phiêu Lưu Ký", created_at: new Date().toISOString(), created_by_name: "Admin" },
            { book_id: 102, title: "Đất Rừng Phương Nam", created_at: new Date(Date.now() - 86400000).toISOString(), created_by_name: "Mod" },
            { book_id: 103, title: "Mắt Biếc", created_at: new Date(Date.now() - 172800000).toISOString(), created_by_name: "Admin" }
        ];
    }
};

// ==========================================
// getRecommendations - Lấy danh sách sách đề xuất
// ==========================================

/**
 * Lấy danh sách sách đề xuất cho người dùng
 * Endpoint: GET /book/recommendation
 * 
 * @param {number} [limit] - Số lượng sách cần lấy
 * @returns {Promise<Array>} Danh sách sách đề xuất
 */
export const getRecommendations = async (limit = 12) => {
    try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get('/book/recommendation', {
            params: { limit },
            headers
        });
        return response.data['books'];
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
};

// ==========================================
// Utility Functions - Các hàm tiện ích
// ==========================================

/**
 * Tạo query string từ object params
 * Sử dụng khi cần build URL manually (ví dụ: cho navigation)
 * 
 * @param {Object} params - Object chứa các params
 * 
 * @returns {string} Query string đã format (bao gồm dấu ?)
 * 
 * @example
 * const qs = buildQueryString({ category: 'abc', page: 2 });
 * // Kết quả: "?category=abc&page=2"
 * 
 * navigate(`/search${qs}`);
 */
export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();

    // Chỉ thêm các params có giá trị hợp lệ
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, value);
        }
    });

    const str = searchParams.toString();

    // Trả về với dấu ? nếu có params, ngược lại trả về chuỗi rỗng
    return str ? `?${str}` : '';
};

/**
 * Parse query string thành object
 * Sử dụng khi cần đọc params từ URL
 * 
 * @param {string} search - URL search string (phần sau dấu ?)
 * 
 * @returns {Object} Object chứa các cặp key-value
 * 
 * @example
 * const params = parseQueryString('?category=abc&page=2');
 * // Kết quả: { category: 'abc', page: '2' }
 */
export const parseQueryString = (search) => {
    const params = new URLSearchParams(search);
    const result = {};

    // Chuyển đổi URLSearchParams thành object thông thường
    params.forEach((value, key) => {
        result[key] = value;
    });

    return result;
};

// ==========================================
// Export Service Object
// Mô tả: Tập hợp tất cả các hàm vào một object để dễ import
// 
// Cách sử dụng:
//   import bookService from '@/services/book.service';
//   const books = await bookService.getAll({ limit: 10 });
// 
// Hoặc import riêng từng hàm:
//   import { getAll, getById } from '@/services/book.service';
// ==========================================

const bookService = {
    getAll,           // Lấy danh sách sách
    getById,          // Lấy chi tiết sách
    getByIsbn,        // Lấy chi tiết sách theo ISBN
    getBooksByIdentifiers, // Batch fetch identifiers
    getBookCopies,    // Lấy danh sách bản sao
    getRecentBooks,   // Lấy sách mới thêm
    getRecommendations, // Lấy sách đề xuất
    buildQueryString, // Tạo query string
    parseQueryString, // Parse query string
};

export default bookService;
