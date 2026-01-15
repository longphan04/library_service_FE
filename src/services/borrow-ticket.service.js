// ==========================================
// Borrow Ticket Service
// Mô tả: Service xử lý borrow tickets (phiếu mượn sách)
// GET /borrow-ticket/me, GET /borrow-ticket/:id
// ==========================================

import axios from './axios';

/**
 * Lấy danh sách phiếu mượn của user hiện tại
 * @returns {Promise} - Array of borrow tickets
 */
export const getMyTickets = async () => {
    const response = await axios.get('/borrow-ticket/me');
    return response.data;
};

/**
 * Lấy thông tin chi tiết phiếu mượn theo ID
 * @param {string|number} id - Borrow ticket ID
 * @returns {Promise} - Borrow ticket data
 */
export const getById = async (id) => {
    const response = await axios.get(`/borrow-ticket/${id}`);
    return response.data;
};

const borrowTicketService = {
    getMyTickets,
    getById,
};

export default borrowTicketService;
