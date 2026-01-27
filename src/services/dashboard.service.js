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

/**
 * Lấy thống kê mượn-trả sách theo khoảng thời gian
 * @param {string} period - 'week' cho 7 ngày gần nhất, 'month' cho 30 ngày gần nhất
 * @returns {Promise} - { data: { period, days, start_date, end_date, chart: [], summary: {} } }
 */
export const getBorrowApprovedStats = async (period = 'week') => {
    try {
        const response = await axios.get('/dashboard/borrow-return', {
            params: { period }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching borrow-approved statistics:', error);
        throw error;
    }
};

/**
 * Lấy thống kê luồng phiếu (pending, approved, cancelled)
 * @param {string} period - 'week' cho 7 ngày gần nhất, 'month' cho 30 ngày gần nhất
 * @returns {Promise} - { data: { period, days, start_date, end_date, chart: [], summary: {} } }
 */
export const getTicketFlowStats = async (period = 'week') => {
    try {
        const response = await axios.get('/dashboard/ticket-flow', {
            params: { period }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching ticket flow statistics:', error);
        throw error;
    }
};

const dashboardService = {
    getRecentActivity,
    getBorrowApprovedStats,
    getTicketFlowStats,
};

export default dashboardService;
