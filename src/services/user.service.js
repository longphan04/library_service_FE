// ==========================================
// User Service
// Mô tả: Service xử lý user profile và admin user management
// ==========================================

import axios from './axios';

// ==========================================
// User Profile Endpoints (Current User)
// ==========================================

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise} - User data
 */
export const getMe = async () => {
    const response = await axios.get('/profile/me');
    return response.data;
};

/**
 * Cập nhật thông tin user hiện tại
 * @param {Object} data - User data to update
 * @returns {Promise} - Updated user data
 */
export const updateMe = async (data) => {
    const response = await axios.put('/profile/me', data);
    // API returns profile data in response.data.data
    return response.data.data || response.data;
};

// ==========================================
// Admin User Management Endpoints
// ==========================================

/**
 * Lấy danh sách tất cả người dùng/thành viên
 * @param {Object} options - Query options (search, page, limit, etc.)
 * @returns {Promise} - List of users with pagination
 * @throws {Error} - Unauthorized if user is not authenticated
 */
export const getUsers = async (options = {}) => {
    try {
        const params = new URLSearchParams();
        if (options.search) params.append('search', options.search);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.status) params.append('status', options.status);

        const url = params.toString() ? `/user/member?${params.toString()}` : '/user/member';
        const response = await axios.get(url);

        // Transform API response to match frontend expectations
        if (response.data.data && Array.isArray(response.data.data)) {
            const transformedUsers = response.data.data.map(user => ({
                id: user.user_id,
                name: user.profile?.full_name || user.full_name || 'N/A',
                email: user.email,
                status: user.status?.toLowerCase() || 'inactive',
                createdAt: user.created_at || user.createdAt || new Date().toISOString(),
                username: user.username || user.email,
                isActive: user.status === 'ACTIVE' || user.status === 'active',
                isBanned: user.status === 'BANNED' || user.status === 'banned',
            }));

            return {
                data: transformedUsers,
                pagination: response.data.pagination || {
                    page: 1,
                    limit: 18,
                    total: response.data.data.length,
                    totalItems: response.data.pagination?.totalItems || response.data.data.length,
                },
            };
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Lấy thông tin chi tiết của một người dùng (Admin only)
 * @param {number|string} userId - User ID
 * @returns {Promise} - User data
 * @throws {Error} - Unauthorized if user is not admin or user not found
 */
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Cập nhật trạng thái hoạt động của người dùng
 * Status có thể là: 'active' (hoạt động) hoặc 'banned' (bị khóa)
 * @param {number|string} userId - User ID
 * @param {string} status - New status ('active' or 'banned')
 * @returns {Promise} - Updated user data
 * @throws {Error} - Unauthorized if user is not authenticated or invalid status
 */
export const updateUserStatus = async (userId, status) => {
    try {
        if (!['active', 'banned'].includes(status)) {
            throw new Error('Invalid status. Must be "active" or "banned"');
        }

        // Convert status to API format (ACTIVE/BANNED for API, lowercase for frontend)
        const apiStatus = status === 'banned' ? 'BANNED' : 'ACTIVE';

        console.log(`🔍 [UserService] Updating user ${userId} status to ${apiStatus}`);
        console.log(`🌐 [UserService] PATCH /user/${userId}`);

        const response = await axios.patch(`/user/${userId}`, {
            status: apiStatus
        });

        console.log(`✅ [UserService] SUCCESS:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ [UserService] Error updating user ${userId} status:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Xóa một người dùng (Admin only)
 * @param {number|string} userId - User ID
 * @returns {Promise} - Confirmation message
 * @throws {Error} - Unauthorized if user is not admin or user not found
 */
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Cập nhật thông tin người dùng (Admin only)
 * @param {number|string} userId - User ID
 * @param {Object} data - User data to update
 * @returns {Promise} - Updated user data
 * @throws {Error} - Unauthorized if user is not admin or validation error
 */
export const updateUserInfo = async (userId, data) => {
    try {
        const response = await axios.put(`/admin/users/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating user ${userId} info:`, error.response?.data || error.message);
        throw error;
    }
};

const userService = {
    // User profile
    getMe,
    updateMe,

    // Admin user management
    getUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
    updateUserInfo,
};

export default userService;
