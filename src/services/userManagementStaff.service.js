import axios from './axios';

export const userManagementStaffService = {
    /**
     * Lấy danh sách thành viên
     */
    getMembers: async () => {
        try {
            const response = await axios.get('/user/member');
            // Format data: id, name, email, date, status
            if (response.data.data && Array.isArray(response.data.data)) {
                return response.data.data.map(user => ({
                    id: user.user_id,
                    name: user.profile?.full_name || 'N/A',
                    email: user.email,
                    date: user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A',
                    status: user.status === 'BANNED' ? 'locked' : 'active',
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching members:', error);
            throw error;
        }
    },

    /**
     * Cập nhật trạng thái người dùng
     */
    updateUserStatus: async (userId, status) => {
        try {
            // API status: ACTIVE or BANNED
            const apiStatus = status === 'locked' ? 'BANNED' : 'ACTIVE';
            const response = await axios.patch(`/user/${userId}`, { status: apiStatus });
            return response.data;
        } catch (error) {
            console.error(`Error updating user ${userId} status:`, error);
            throw error;
        }
    },

    /**
     * Lấy lịch sử mượn sách của người dùng
     */
    getUserBorrowHistory: async (userId) => {
        try {
            const response = await axios.get(`/borrow-ticket/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching borrow history for user ${userId}:`, error);
            throw error;
        }
    }
};

export default userManagementStaffService;
