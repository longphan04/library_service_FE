// ==========================================
// Borrow Ticket Service
// Mô tả: Service xử lý borrow tickets (phiếu mượn sách)
// Endpoints: GET /borrow-ticket/me, GET /borrow-ticket/:id, POST /borrow-ticket
// ==========================================

import axios from './axios';

// ==========================================
// Type Definitions (JSDoc)
// ==========================================

/**
 * @typedef {Object} BorrowTicketBook
 * @property {number|string} id - Book ID
 * @property {string} title - Tên sách
 * @property {string} [author] - Tên tác giả
 * @property {string} [coverImage] - URL ảnh bìa
 */

/**
 * @typedef {Object} BorrowTicket
 * @property {number|string} id - Ticket ID
 * @property {string} status - Trạng thái: PENDING, APPROVED, BORROWED, RETURNED, OVERDUE
 * @property {string} borrowDate - Ngày mượn (ISO string)
 * @property {string} dueDate - Ngày trả dự kiến (ISO string)
 * @property {string} [returnDate] - Ngày trả thực tế (ISO string)
 * @property {BorrowTicketBook[]} books - Danh sách sách trong phiếu
 * @property {string} createdAt - Ngày tạo (ISO string)
 * @property {string} updatedAt - Ngày cập nhật (ISO string)
 */

// ==========================================
// API Functions
// ==========================================

/**
 * Lấy danh sách phiếu mượn của user hiện tại
 * @returns {Promise<BorrowTicket[]>} - Danh sách phiếu mượn
 */
export const getMyTickets = async () => {
    const response = await axios.get('/borrow-ticket/me');
    return response.data;
};

/**
 * Lấy thông tin chi tiết phiếu mượn theo ID
 * @param {string|number} id - Borrow ticket ID
 * @returns {Promise<BorrowTicket>} - Chi tiết phiếu mượn
 * @throws {Error} Nếu id không hợp lệ
 */
export const getById = async (id) => {
    // Input validation
    if (!id) {
        throw new Error('Borrow ticket ID is required');
    }

    const response = await axios.get(`/borrow-ticket/${id}`);
    return response.data;
};

/**
 * Tạo phiếu mượn cho nhiều sách (từ book holds)
 * @param {Array<string|number>} bookHoldIds - Danh sách book hold IDs
 * @returns {Promise<BorrowTicket>} - Phiếu mượn được tạo
 * @throws {Error} Nếu bookHoldIds không hợp lệ
 */
export const createBorrowRequest = async (bookHoldIds) => {
    // Input validation - Defensive Programming
    if (!Array.isArray(bookHoldIds)) {
        throw new Error('bookHoldIds must be an array');
    }

    if (bookHoldIds.length === 0) {
        throw new Error('bookHoldIds cannot be empty');
    }

    // Filter out any null/undefined values
    const validIds = bookHoldIds.filter((id) => id != null);

    if (validIds.length === 0) {
        throw new Error('No valid book hold IDs provided');
    }

    const response = await axios.post('/borrow-ticket', {
        bookHoldIds: validIds
    });
    return response.data;
};

/**
 * Hủy phiếu mượn (nếu backend hỗ trợ)
 * @param {string|number} id - Borrow ticket ID
 * @returns {Promise<void>}
 * @throws {Error} Nếu id không hợp lệ
 */
export const cancelTicket = async (id) => {
    if (!id) {
        throw new Error('Borrow ticket ID is required');
    }

    const response = await axios.delete(`/borrow-ticket/${id}`);
    return response.data;
};
