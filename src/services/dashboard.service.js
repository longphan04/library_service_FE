// ==========================================
// Dashboard Service
// Mô tả: Service xử lý các API liên quan đến dashboard
// ==========================================

import axios from './axios';

/**
 * Lấy thông tin hoạt động gần đây (sách mới, mượn, trả)
 * @returns {Promise} - { data: { recent_book, recent_borrow_ticket, recent_return_ticket } }
 */
export const getRecentActivity = async () => {
    try {
        const response = await axios.get('/dashboard/recent');
        return response.data;
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
    }
};

const dashboardService = {
    getRecentActivity,
};

export default dashboardService;
