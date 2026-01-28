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
                return response.data.data.map(user => {
                    const profileData = user.profile || user || {};
                    const userData = user.user || user || {};
                    const rawDate = user.created_at || profileData.created_at || userData.created_at || user.createdAt;

                    return {
                        id: user.user_id || user.id,
                        name: profileData.full_name || user.full_name || 'N/A',
                        email: userData.email || user.email || 'N/A',
                        date: rawDate ? new Date(rawDate).toLocaleDateString('vi-VN') : 'N/A',
                        avatar: profileData.avatar_url || user.avatar_url || profileData.avatar || user.avatar || null,
                        phone: profileData.phone || user.phone || null,
                        status: (userData.status || user.status || 'ACTIVE').toUpperCase() === 'BANNED' ? 'locked' : 'active',
                    };
                });
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
