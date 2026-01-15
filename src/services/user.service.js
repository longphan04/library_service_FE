// ==========================================
// User Service
// Mô tả: Service xử lý user profile (GET/PUT /users/me)
// ==========================================

import axios from './axios';

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise} - User data
 */
export const getMe = async () => {
    const response = await axios.get('/users/me');
    return response.data;
};

/**
 * Cập nhật thông tin user hiện tại
 * @param {Object} data - User data to update
 * @returns {Promise} - Updated user data
 */
export const updateMe = async (data) => {
    const response = await axios.put('/users/me', data);
    return response.data;
};

const userService = {
    getMe,
    updateMe,
};

export default userService;
