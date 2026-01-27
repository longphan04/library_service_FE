import axios from 'axios';

// Tạo axios instance với config cho ngrok
const axiosInstance = axios.create({
    headers: {
        'ngrok-skip-browser-warning': 'true',
    },
});

// Thêm auth token interceptor
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
