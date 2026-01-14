// ==========================================
// Axios Instance Configuration
// Mô tả: Cấu hình axios với interceptors cho authentication
// ==========================================

import axios from 'axios';

// Tạo axios instance với base URL từ environment variable
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==========================================
// Request Interceptor
// Mô tả: Tự động gắn token vào header Authorization
// ==========================================
instance.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('auth_token');

        // Nếu có token, gắn vào header Authorization với prefix Bearer
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Xử lý lỗi khi tạo request
        return Promise.reject(error);
    }
);

// ==========================================
// Response Interceptor
// Mô tả: Xử lý response và error (đặc biệt là 401)
// ==========================================
instance.interceptors.response.use(
    (response) => {
        // Trả về response nếu thành công
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 (Unauthorized - token hết hạn hoặc không hợp lệ)
        if (error.response && error.response.status === 401) {
            // Xóa token khỏi localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            // Chuyển hướng về trang login
            // Chỉ redirect nếu không phải đang ở trang login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default instance;

