// ==========================================
// RoleRoute Guard
// Mô tả: Route guard kiểm tra role của user
// Vị trí: src/components/guards/RoleRoute.jsx
// ==========================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasRole } from '../../constants/roles';

/**
 * RoleRoute Component
 *
 * Guard component bảo vệ routes dựa trên role của user.
 * Yêu cầu user đã đăng nhập VÀ có role được phép.
 *
 * @param {React.ReactNode} children - Component cần được bảo vệ
 * @param {string[]} allowedRoles - Danh sách roles được phép truy cập
 * @param {string} redirectTo - URL redirect nếu không có quyền (default: '/login')
 * @returns {React.ReactNode}
 *
 * @example
 * <RoleRoute allowedRoles={[ROLES.MEMBER]}>
 *   <Bookshelf />
 * </RoleRoute>
 *
 * @example
 * <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]} redirectTo="/unauthorized">
 *   <AdminDashboard />
 * </RoleRoute>
 */
const RoleRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // Nếu đang load, chờ
    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-app flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-sub">Đang tải...</p>
                </div>
            </div>
        );
    }

    // Nếu chưa đăng nhập, redirect về login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Lấy role từ user object
    const userRole = user?.role || user?.roles?.[0] || null;

    // Nếu không có allowedRoles, cho phép tất cả authenticated users
    if (allowedRoles.length === 0) {
        return children;
    }

    // Kiểm tra user có role được phép không
    if (!userRole || !hasRole(userRole, allowedRoles)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default RoleRoute;
