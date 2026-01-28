// ==========================================
// Auth Service
// Mô tả: Service xử lý authentication (login, logout, register, refresh token)
// ==========================================

import axios, { getToken, getRefreshToken, setTokens, clearTokens } from './axios';
import { getAvatarUrl } from '../utils/imageUrl';

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

        if (accessToken) {
            setTokens(accessToken, refreshToken);
        }

        // Fetch profile data after login
        let userData = user;
        if (user) {
            try {
                const profileResponse = await axios.get('/profile/me');
                const profileData = profileResponse.data.data || profileResponse.data;

                // Merge user data with profile data
                userData = {
                    ...user,
                    profile: profileData,
                    fullName: profileData.full_name,
                    full_name: profileData.full_name,
                    // Map avatar fields (ensure we catch all potential backend field names)
                    avatar: getAvatarUrl(profileData.avatar || profileData.avatar_url || profileData.image || profileData.imageUrl || profileData.avatarUrl),
                    avatarUrl: getAvatarUrl(profileData.avatar || profileData.avatar_url || profileData.image || profileData.imageUrl || profileData.avatarUrl),
                };
            } catch (profileError) {
                console.error('Failed to fetch profile data:', profileError);
                // Continue with basic user data if profile fetch fails
            }

            localStorage.setItem('user', JSON.stringify(userData));
        }

        return {
            ...response.data,
            user: userData
        };
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
 * Đăng nhập cho Staff/Admin
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - Response data từ server
 */
export const loginStaff = async (credentials) => {
    try {
        const response = await axios.post('/auth/login-staff', credentials);

        // Handle various token field names from different API responses
        const accessToken = response.data.accessToken || response.data.token || response.data.access_token;
        const refreshToken = response.data.refreshToken || response.data.refresh_token;
        const user = response.data.user;

        if (accessToken) {
            setTokens(accessToken, refreshToken);
        }

        // Fetch profile data after login
        let userData = user;
        if (user) {
            try {
                const profileResponse = await axios.get('/profile/me');
                const profileData = profileResponse.data.data || profileResponse.data;

                // Merge user data with profile data
                userData = {
                    ...user,
                    profile: profileData,
                    fullName: profileData.full_name,
                    full_name: profileData.full_name,
                    // Map avatar fields (ensure we catch all potential backend field names)
                    avatar: getAvatarUrl(profileData.avatar || profileData.avatar_url || profileData.image || profileData.imageUrl || profileData.avatarUrl),
                    avatarUrl: getAvatarUrl(profileData.avatar || profileData.avatar_url || profileData.image || profileData.imageUrl || profileData.avatarUrl),
                };
            } catch (profileError) {
                console.error('Failed to fetch profile data:', profileError);
                // Continue with basic user data if profile fetch fails
            }

            localStorage.setItem('user', JSON.stringify(userData));
        }

        return {
            ...response.data,
            user: userData
        };
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message;

            if (status === 401 || status === 400) {
                throw new Error(message || 'Email hoặc mật khẩu không đúng');
            } else if (status === 403) {
                throw new Error(message || 'Bạn không có quyền truy cập');
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
 * Lấy thông tin user hiện tại
 * @returns {Promise} - User data từ server
 */
export const getCurrentUser = async () => {
    try {
        // Get existing user data from localStorage to preserve roles
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}');

        const response = await axios.get('/profile/me');
        const profileData = response.data.data || response.data;

        // Merge basic user info with profile data, preserving roles from existing user
        const user = {
            user_id: profileData.user_id,
            email: profileData.email || existingUser.email || '',
            status: profileData.status || existingUser.status || 'ACTIVE',
            roles: existingUser.roles || ['USER'], // Preserve roles from existing user data
            profile: profileData,
            fullName: profileData.full_name,
            full_name: profileData.full_name,
            // Map avatar fields (ensure we catch all potential backend field names)
            avatar: getAvatarUrl(profileData.avatar || profileData.avatar_url || profileData.image || profileData.imageUrl || profileData.avatarUrl),
            avatarUrl: getAvatarUrl(profileData.avatar || profileData.avatar_url || profileData.image || profileData.imageUrl || profileData.avatarUrl),
        };

        console.log('[AuthService] getCurrentUser profileData:', profileData);
        console.log('[AuthService] Mapped User:', user);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        return user;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            clearTokens();
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

/**
 * Quên mật khẩu - Gửi email để lấy lại mật khẩu
 * Endpoint: POST /forgot-password
 * @param {Object} data - { email: string }
 * @returns {Promise} - Response từ server
 */
export const forgotPassword = async (data) => {
    console.log('[forgotPassword] 📤 Calling POST /forgot-password with:', data);

    try {
        const response = await axios.post('/forgot-password', data);
        console.log('[forgotPassword] ✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('[forgotPassword] ❌ Error:', error.response?.status, error.response?.data);

        if (error.response) {
            const message = error.response.data?.message;
            throw new Error(message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error('Đã có lỗi xảy ra');
        }
    }
};

/**
 * Reset mật khẩu - Đặt lại mật khẩu với token từ email
 * Endpoint: POST /reset-password
 * @param {Object} data - { token: string, password: string }
 * @returns {Promise} - Response từ server
 */
export const resetPassword = async (data) => {
    console.log('[resetPassword] 📤 Calling POST /reset-password');

    try {
        const response = await axios.post('/reset-password', data);
        console.log('[resetPassword] ✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('[resetPassword] ❌ Error:', error.response?.status, error.response?.data);

        if (error.response) {
            const message = error.response.data?.message;
            throw new Error(message || 'Đặt lại mật khẩu thất bại. Token có thể đã hết hạn.');
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
    loginStaff,
    logout,
    register,
    refreshToken,
    getCurrentUser,
    changePassword,
    forgotPassword,
    resetPassword,
    getToken,
    getRefreshToken,
    setTokens,
    removeToken,
    clearTokens,
    isAuthenticated,
};

export default authService;
