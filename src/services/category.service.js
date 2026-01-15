// ==========================================
// Category Service
// Mô tả: Service xử lý category (GET /category, GET /category/:id)
// ==========================================

import axios from './axios';

/**
 * Lấy danh sách tất cả categories
 * @returns {Promise} - Array of categories
 */
export const getAll = async () => {
    const response = await axios.get('/category');
    return response.data;
};

/**
 * Lấy thông tin chi tiết category theo ID
 * @param {string|number} id - Category ID
 * @returns {Promise} - Category data
 */
export const getById = async (id) => {
    const response = await axios.get(`/category/${id}`);
    return response.data;
};

const categoryService = {
    getAll,
    getById,
};

export default categoryService;
