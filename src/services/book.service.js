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

import axios from './axios';

// ==========================================
// getAll - Lấy danh sách sách
// ==========================================

/**
 * Lấy danh sách sách với các tùy chọn filter, search, sort, pagination
 * 
 * @param {Object} params - Các tham số truy vấn
 * @param {string} [params.category] - ID danh mục để lọc sách
 * @param {string} [params.keyword] - Từ khóa tìm kiếm (tên sách hoặc tác giả)
 * @param {string} [params.sort] - Cách sắp xếp:
 *                                  - 'title': Theo tên A-Z
 *                                  - '-title': Theo tên Z-A
 *                                  - 'createdAt': Cũ nhất trước
 *                                  - '-createdAt': Mới nhất trước
 * @param {number} [params.page] - Số trang cần lấy (bắt đầu từ 1)
 * @param {number} [params.limit] - Số sách mỗi trang
 * 
 * @returns {Promise<Object>} Response object chứa:
 *   - data/books: Mảng sách
 *   - total: Tổng số sách
 *   - page: Trang hiện tại
 *   - totalPages: Tổng số trang
 * 
 * @example
 * // Lấy 12 sách đầu tiên
 * const result = await bookService.getAll({ limit: 12 });
 * 
 * // Lấy sách theo danh mục với tìm kiếm
 * const result = await bookService.getAll({
 *   category: 'abc123',
 *   keyword: 'Việt Nam',
 *   page: 1,
 *   limit: 12
 * });
 */
export const getAll = async (params = {}) => {
    // Lọc bỏ các params có giá trị undefined, null hoặc chuỗi rỗng
    // Điều này giúp tránh gửi params không cần thiết lên server
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});

    // Gọi API GET /book với các query params
    const response = await axios.get('/book', { params: cleanParams });

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
    // Gọi API GET /book/:id
    const response = await axios.get(`/book/${id}`);
    return response.data;
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
    getBookCopies,    // Lấy danh sách bản sao
    buildQueryString, // Tạo query string
    parseQueryString, // Parse query string
};

export default bookService;
