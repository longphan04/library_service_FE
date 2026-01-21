// ==========================================
// Auth Service
// Mô tả: Service xử lý authentication (login, logout, register, refresh token)
// ==========================================

import axios, { getToken, getRefreshToken, setTokens, clearTokens } from './axios';
import { buildImageUrl } from '../utils/imageUrl';

// ==========================================
// Token Management Functions (re-export)
// ==========================================
export { getToken, getRefreshToken, setTokens, clearTokens };

export const removeToken = clearTokens;

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean} - True nếu có token
 */
export const isAuthenticated = () => {
    return !!getToken();
};

// ==========================================
// Auth API Functions
// ==========================================

/**
 * Đăng nhập
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - Response data từ server
 */
export const login = async (credentials) => {
    try {
        const response = await axios.post('/auth/login', credentials);

        // Handle various token field names from different API responses
        const accessToken = response.data.accessToken || response.data.token || response.data.access_token;
        const refreshToken = response.data.refreshToken || response.data.refresh_token;
        const user = response.data.user;

        // Log để debug
        console.log('Login response:', response.data);
        console.log('Access token:', accessToken);

        if (accessToken) {
            setTokens(accessToken, refreshToken);
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message;

            if (status === 401 || status === 400) {
                throw new Error(message || 'Email hoặc mật khẩu không đúng');
            } else if (status === 500) {
                throw new Error('Lỗi server. Vui lòng thử lại sau');
            } else {
                throw new Error(message || 'Đã có lỗi xảy ra');
            }
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error('Đã có lỗi xảy ra');
        }
    }
};

/**
 * Đăng xuất
 * @returns {Promise} - Response từ server
 */
export const logout = async () => {
    try {
        await axios.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearTokens();
    }
};

/**
 * Refresh access token
 * @returns {Promise} - New tokens
 */
export const refreshToken = async () => {
    const currentRefreshToken = getRefreshToken();

    if (!currentRefreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await axios.post('/auth/refresh', {
            refreshToken: currentRefreshToken,
        });

        const newAccessToken = response.data.token || response.data.access_token;
        const newRefreshToken = response.data.refreshToken || response.data.refresh_token;

        if (newAccessToken) {
            setTokens(newAccessToken, newRefreshToken);
        }

        return response.data;
    } catch (error) {
        clearTokens();
        throw error;
    }
};

/**
 * Lấy thông tin user hiện tại từ API
 * @returns {Promise<{id: string, email: string, name: string, role: string, avatar: string}>}
 * @throws {Error} Nếu token không hợp lệ hoặc hết hạn
 */
export const getCurrentUser = async () => {
    const token = getToken();

    // Không có token → chưa đăng nhập
    if (!token) {
        return null;
    }

    try {
        const response = await axios.get('/profile/me');
        const data = response.data;

        // Lấy raw avatar path từ API (field avatar_url chứa path như "avatar/filename.jpg")
        const rawAvatar = data.avatar_url || data.avatar || data.avatarUrl || data.profileImage;

        // DEBUG: Log avatar URL processing
        console.log('[Auth] Raw avatar path from API:', rawAvatar);
        console.log('[Auth] Built avatar URL:', buildImageUrl(rawAvatar));

        // Normalize user data - đảm bảo các fields cần thiết
        const user = {
            id: data.id || data._id || data.userId,
            email: data.email,
            name: data.name || data.fullName || data.username,
            role: data.role || data.roles?.[0] || 'MEMBER',
            avatar: buildImageUrl(rawAvatar),
        };

        // Cache user data
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    } catch (error) {
        // Token hết hạn / không hợp lệ → logout và redirect
        if (error.response?.status === 401) {
            clearTokens();
            // Redirect về login nếu không phải đang ở trang login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        throw error;
    }
};

/**
 * Đăng ký tài khoản mới
 * @param {Object} userData - { email, password, name, ... }
 * @returns {Promise} - Response từ server
 */
export const register = async (userData) => {
    try {
        const response = await axios.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data?.message;
            throw new Error(message || 'Đăng ký thất bại');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error('Đã có lỗi xảy ra');
        }
    }
};

/**
 * Đổi mật khẩu
 * @param {Object} data - { currentPassword, newPassword }
 * @returns {Promise} - Response từ server
 */
export const changePassword = async (data) => {
    try {
        const response = await axios.patch('/auth/change-password', data);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data?.message;
            throw new Error(message || 'Đổi mật khẩu thất bại');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error('Đã có lỗi xảy ra');
        }
    }
};

// Export default object chứa tất cả functions
const authService = {
    login,
    logout,
    register,
    refreshToken,
    getCurrentUser,
    changePassword,
    getToken,
    getRefreshToken,
    setTokens,
    removeToken,
    clearTokens,
    isAuthenticated,
};

export default authService;
