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
    // Debug: Log raw API response to understand ID structure
    console.log('[book-hold.service] getMyHolds raw response:', response.data);
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
 * Thử nhiều pattern endpoint vì backend có thể hỗ trợ khác nhau:
 * 1. DELETE /book-hold/:id (chuẩn RESTful)
 * Endpoint: DELETE /book-hold (với body { hold_id })
 * @param {string|number} holdId - Book hold ID
 * @returns {Promise} - Response
 */
export const remove = async (holdId) => {
    console.log('[book-hold.service] Calling DELETE /book-hold with body { hold_id:', holdId, '}');

    try {
        // Pattern đã confirm hoạt động: DELETE với body
        const response = await axios.delete('/book-hold', {
            data: { hold_id: holdId }
        });
        console.log('[book-hold.service] Delete response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[book-hold.service] DELETE failed:', error.response?.status, error.response?.data);
        throw error;
    }
};

const bookHoldService = {
    getMyHolds,
    create,
    remove,
};

export default bookHoldService;
