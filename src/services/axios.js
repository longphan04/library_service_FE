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
const instance = axios.create({
    baseURL: import.meta.env.DEV ? '/' : (import.meta.env.VITE_API_BASE_URL || '/'),
    headers: {
        'Content-Type': 'application/json',
        ...NGROK_HEADERS, // Quan trọng: Luôn kèm header bypass ngrok cho mọi request qua instance
    },
});

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
// Mô tả: Tự động gắn token vào header Authorization
// ==========================================
instance.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==========================================
// Response Interceptor
// Mô tả: Xử lý response và error (đặc biệt là 401 với token refresh)
// ==========================================
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Xử lý lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Nếu đang refresh, đưa request vào queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return instance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    // Gọi API refresh token (kèm header ngrok bypass vì dùng axios trực tiếp)
                    const response = await axios.post(
                        '/auth/refresh',
                        { refreshToken },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                ...NGROK_HEADERS
                            },
                        }
                    );

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

                    // Redirect về login
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // Không có refresh token, redirect về login
                clearTokens();
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
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
