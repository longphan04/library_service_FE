// ==========================================
// ProtectedRoute Guard
// Mô tả: Route guard bảo vệ routes yêu cầu authentication
// Vị trí: src/componants/guards/ProtectedRoute.jsx
// ==========================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Guard component bảo vệ routes chỉ dành cho user đã đăng nhập.
 * 
 * @param {React.ReactNode} children - Component cần được bảo vệ
 * @returns {React.ReactNode} - Children nếu authenticated, Navigate nếu không
 * 
 * @example
 * <ProtectedRoute>
 *   <Bookshelf />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Nếu user chưa đăng nhập, redirect về trang Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // User đã đăng nhập, cho phép truy cập
    return children;
};

export default ProtectedRoute;
