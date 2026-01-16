// ==========================================
// Book Service
// Mô tả: Service xử lý books (GET /book, GET /book/:id)
// Hỗ trợ query params: category, keyword, sort, page, limit
// ==========================================

import axios from './axios';

/**
 * Lấy danh sách sách với query params
 * @param {Object} params - Query parameters
 * @param {string} [params.category] - Filter by category ID
 * @param {string} [params.keyword] - Search keyword
 * @param {string} [params.sort] - Sort order (e.g., 'title', '-title', 'createdAt')
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @returns {Promise} - { data: Book[], total, page, totalPages }
 */
export const getAll = async (params = {}) => {
    // Lọc bỏ các params undefined/null/empty
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});

    const response = await axios.get('/book', { params: cleanParams });
    return response.data;
};

/**
 * Lấy thông tin chi tiết sách theo ID
 * @param {string|number} id - Book ID
 * @returns {Promise} - Book data
 */
export const getById = async (id) => {
    const response = await axios.get(`/book/${id}`);
    return response.data;
};

/**
 * Build query string từ params object
 * @param {Object} params - Query parameters
 * @returns {string} - Query string (e.g., "?category=1&page=2")
 */
export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, value);
        }
    });

    const str = searchParams.toString();
    return str ? `?${str}` : '';
};

/**
 * Parse query string thành object
 * @param {string} search - URL search string
 * @returns {Object} - Parsed params
 */
export const parseQueryString = (search) => {
    const params = new URLSearchParams(search);
    const result = {};

    params.forEach((value, key) => {
        result[key] = value;
    });

    return result;
};

const bookService = {
    getAll,
    getById,
    buildQueryString,
    parseQueryString,
};

export default bookService;
