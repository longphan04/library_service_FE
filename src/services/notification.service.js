// ==========================================
// Notification Service
// Mô tả: Service xử lý thông báo cho user
// Endpoint: GET /notification
// ==========================================

import axios from './axios';

/**
 * Lấy danh sách thông báo của user hiện tại
 * Endpoint: GET /notification
 * @returns {Promise<Array>} - Danh sách thông báo (tối đa 10 mới nhất)
 */
export const getNotifications = async () => {
    console.log('[NotificationService] 🔍 Calling GET /notification...');

    try {
        const response = await axios.get('/notification');
        console.log('[NotificationService] ✅ Response:', response.data);

        // Lấy data từ response (có thể là mảng trực tiếp hoặc trong .data)
        const data = Array.isArray(response.data)
            ? response.data
            : (response.data?.data || response.data?.notifications || []);

        // Sắp xếp theo thời gian giảm dần và giới hạn 10 thông báo
        const sortedData = data
            .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
            .slice(0, 10);

        return sortedData;
    } catch (error) {
        console.error('[NotificationService] ❌ Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

const notificationService = {
    getNotifications,
};

export default notificationService;
