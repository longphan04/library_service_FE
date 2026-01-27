// ==========================================
// Axios Instance Configuration
// Mô tả: Cấu hình axios với interceptors cho authentication và token refresh
// ==========================================

import axios from 'axios';

// ==========================================
// Header Configuration
// ==========================================
const NGROK_HEADERS = {
    'ngrok-skip-browser-warning': 'true',
};

// Tạo axios instance
// Trong môi trường development (Vite), ta sử dụng relative path '/' để Vite proxy bắt được và bypass CORS.
// Trong production, ta sẽ sử dụng URL đầy đủ từ biến môi trường.
// Tạo axios instance
const instance = axios.create({
    baseURL: import.meta.env.DEV ? '/' : (import.meta.env.VITE_API_BASE_URL || '/'),
    headers: {
        'Content-Type': 'application/json',
        ...NGROK_HEADERS,
    },
});

// Đồng bộ baseURL cho global axios để các request dùng axios trực tiếp (như refresh token) đi đúng domain
axios.defaults.baseURL = instance.defaults.baseURL;

// ==========================================
// Token Management
// ==========================================
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};
export const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('user');
};

// Flag để tránh refresh token loop
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ==========================================
// Request Interceptor
// ==========================================
instance.interceptors.request.use(
    (config) => {
        const token = getToken();

        // Danh sách các prefix endpoint yêu cầu login
        const protectedPaths = ['/profile', '/book-hold', '/borrow-ticket', '/notification'];
        const isProtected = protectedPaths.some(path => config.url.startsWith(path));

        // Nếu endpoint yêu cầu auth nhưng không có token, chặn sớm ở FE để tránh 401 từ BE
        if (isProtected && !token) {
            const controller = new AbortController();
            config.signal = controller.signal;
            controller.abort('No auth token available');
            return config;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// Response Interceptor
// ==========================================
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Kiểm tra nếu request bị abort do thiếu token (từ request interceptor)
        if (error.message === 'No auth token available') {
            return Promise.reject(new Error('Vui lòng đăng nhập để thực hiện hành động này'));
        }

        const originalRequest = error.config;

        // Xử lý lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            const refreshToken = getRefreshToken();

            // CHỈ thực hiện refresh nếu CÓ refresh token
            if (refreshToken) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Gọi API refresh (sử dụng global axios đã được set baseURL)
                    const response = await axios.post('/auth/refresh', { refreshToken }, {
                        headers: { ...NGROK_HEADERS }
                    });

                    const newAccessToken = response.data.token || response.data.access_token;
                    const newRefreshToken = response.data.refreshToken || response.data.refresh_token;

                    if (newAccessToken) {
                        setTokens(newAccessToken, newRefreshToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        processQueue(null, newAccessToken);
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    clearTokens();
                    // KHÔNG tự động redirect ở đây để tránh làm phiền Guest đang xem trang chủ
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // Nếu 401 mà không có refresh token -> Guest hặc token quá hạn -> Xóa rác
                clearTokens();
            }
        }

        // Xử lý lỗi 403 (Forbidden - Không có quyền)
        if (error.response && error.response.status === 403) {
            console.error('Access forbidden:', error.response.data?.message || 'Bạn không có quyền truy cập');
        }

        return Promise.reject(error);
    }
);

export default instance;
