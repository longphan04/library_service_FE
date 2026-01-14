// ==========================================
// Auth Service
// Mô tả: Service xử lý authentication (login, logout, get user)
// ==========================================

import axios from './axios';

// ==========================================
// Token Management Functions
// ==========================================

/**
 * Lưu token vào localStorage
 * @param {string} token - JWT token từ server
 */
export const setToken = (token) => {
    localStorage.setItem('auth_token', token);
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} - Token hoặc null nếu không có
 */
export const getToken = () => {
    return localStorage.getItem('auth_token');
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
};

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

        // Lưu token nếu login thành công
        // Giả sử server trả về { token, user } hoặc { access_token, user }
        const token = response.data.token || response.data.access_token;
        const user = response.data.user;

        if (token) {
            setToken(token);
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        return response.data;
    } catch (error) {
        // Xử lý lỗi và throw error có thông báo rõ ràng
        if (error.response) {
            // Server trả về response với status code lỗi
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
            // Request được gửi nhưng không nhận được response
            throw new Error('Không thể kết nối đến server');
        } else {
            // Lỗi khác
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
        // Gọi API logout (optional - tùy backend có yêu cầu không)
        await axios.post('/auth/logout');
    } catch (error) {
        // Vẫn xóa token local dù API lỗi
        console.error('Logout error:', error);
    } finally {
        // Luôn xóa token và user data khỏi localStorage
        removeToken();
    }
};

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise} - User data từ server
 */
export const getCurrentUser = async () => {
    try {
        const response = await axios.get('/auth/me');
        const user = response.data;

        // Cập nhật user trong localStorage
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        return user;
    } catch (error) {
        // Nếu lỗi 401, token đã hết hạn (interceptor sẽ xử lý)
        if (error.response && error.response.status === 401) {
            removeToken();
        }
        throw error;
    }
};

/**
 * Đăng ký tài khoản mới (optional - cho tương lai)
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

// Export default object chứa tất cả functions
const authService = {
    login,
    logout,
    getCurrentUser,
    register,
    setToken,
    getToken,
    removeToken,
    isAuthenticated,
};

export default authService;
