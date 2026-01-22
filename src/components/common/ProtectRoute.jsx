import { Navigate } from "react-router-dom";
import authService from "../../services/auth.service.js";

/**
 * ProtectedRoute Component
 * Bảo vệ route admin bằng cách kiểm tra:
 * 1. User đã đăng nhập (có token)
 * 2. User có role là ADMIN
 */
export default function ProtectedRoute({ children }) {
    // Kiểm tra token
    const token = authService.getToken();

    if (!token) {
        // Không có token, chuyển hướng về login
        return <Navigate to="/login" replace />;
    }

    // Lấy user từ localStorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        // Không có thông tin user, chuyển hướng về login
        return <Navigate to="/login" replace />;
    }

    // Kiểm tra role của user
    // Support multiple formats: role field, roleId field, roles array
    const userRole = user.role || user.roleId;
    const userRoles = user.roles || [];

    const isAdmin =
        userRole === 'ADMIN' ||
        userRole === 1 ||
        userRole === '1' ||
        (Array.isArray(userRoles) && userRoles.includes('ADMIN'));

    if (!isAdmin) {
        // Không phải ADMIN, đăng xuất và chuyển hướng về login
        authService.logout();
        return <Navigate to="/login" replace />;
    }

    // User là ADMIN, cho phép truy cập
    return children;
}
