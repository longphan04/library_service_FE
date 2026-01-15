// ==========================================
// Publisher Service
// Mô tả: Service xử lý publisher (GET /publisher, GET /publisher/:id)
// ==========================================

import axios from './axios';

/**
 * Lấy danh sách tất cả publishers
 * @returns {Promise} - Array of publishers
 */
export const getAll = async () => {
    const response = await axios.get('/publisher');
    return response.data;
};

/**
 * Lấy thông tin chi tiết publisher theo ID
 * @param {string|number} id - Publisher ID
 * @returns {Promise} - Publisher data
 */
export const getById = async (id) => {
    const response = await axios.get(`/publisher/${id}`);
    return response.data;
};

const publisherService = {
    getAll,
    getById,
};

export default publisherService;
