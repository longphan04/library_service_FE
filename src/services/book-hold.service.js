// ==========================================
// Book Hold Service
// Mô tả: Service xử lý book holds (đặt trước sách)
// GET /book-hold/me, POST /book-hold, DELETE /book-hold/:id
// ==========================================

import axios from './axios';

/**
 * Lấy danh sách sách đã đặt trước của user hiện tại
 * @returns {Promise} - Array of book holds
 */
export const getMyHolds = async () => {
    const response = await axios.get('/book-hold/me');
    return response.data;
};

/**
 * Đặt trước một cuốn sách
 * @param {Object} data - { bookId: string|number }
 * @returns {Promise} - Created book hold
 */
export const create = async (data) => {
    const response = await axios.post('/book-hold', data);
    return response.data;
};

/**
 * Hủy đặt trước sách
 * @param {string|number} id - Book hold ID (hold_id)
 * @returns {Promise} - Response
 */
export const remove = async (id) => {
    // Theo đặc tả: DELETE /book-hold/:id
    const response = await axios.delete(`/book-hold/${id}`);
    return response.data;
};

const bookHoldService = {
    getMyHolds,
    create,
    remove,
};

export default bookHoldService;
