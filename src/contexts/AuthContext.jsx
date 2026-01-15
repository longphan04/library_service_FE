// ==========================================
// AuthContext
// Mô tả: Context quản lý trạng thái authentication toàn app
// ==========================================

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { getRedirectByRole } from '../constants/roles';

// Tạo Context
const AuthContext = createContext(null);

// ==========================================
// AuthProvider Component
// ==========================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ==========================================
    // Check Authentication on Mount
    // Kiểm tra xem user đã đăng nhập chưa khi app load
    // ==========================================
    useEffect(() => {
        const checkAuth = async () => {
            const token = authService.getToken();

            if (token) {
                try {
                    // Gọi API để lấy thông tin user
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Nếu token hết hạn hoặc không hợp lệ
                    console.error('Auth check failed:', error);
                    authService.removeToken();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // ==========================================
    // Login Function
    // Returns user data with role for redirect handling
    // ==========================================
    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);

            // Cập nhật state sau khi login thành công
            if (data.user) {
                setUser(data.user);
                setIsAuthenticated(true);
            }

            return data;
        } catch (error) {
            throw error;
        }
    };

    // ==========================================
    // Logout Function
    // ==========================================
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Luôn clear state dù API có lỗi
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // ==========================================
    // Get Redirect Path by User Role
    // ==========================================
    const getRedirectPath = () => {
        const userRole = user?.role || user?.roles?.[0];
        return getRedirectByRole(userRole);
    };

    // Context value
    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getRedirectPath,
    };

    // Hiển thị loading khi đang check auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-app flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-sub">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ==========================================
// useAuth Hook
// Custom hook để sử dụng AuthContext
// ==========================================
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};

export default AuthContext;
