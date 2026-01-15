// ==========================================
// Author Service
// Mô tả: Service xử lý authors (GET /authors, GET /authors/:id)
// ==========================================

import axios from './axios';

/**
 * Lấy danh sách tất cả authors
 * @returns {Promise} - Array of authors
 */
export const getAll = async () => {
    const response = await axios.get('/authors');
    return response.data;
};

/**
 * Lấy thông tin chi tiết author theo ID
 * @param {string|number} id - Author ID
 * @returns {Promise} - Author data
 */
export const getById = async (id) => {
    const response = await axios.get(`/authors/${id}`);
    return response.data;
};

const authorService = {
    getAll,
    getById,
};

export default authorService;
