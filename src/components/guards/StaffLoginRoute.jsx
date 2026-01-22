// ==========================================
// StaffLoginRoute Guard
// Mô tả: Route guard cho trang login Admin/Staff
// Vị trí: src/components/guards/StaffLoginRoute.jsx
// ==========================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../constants/roles';

/**
 * StaffLoginRoute Component
 * 
 * Guard component cho trang /login-staff.
 * - Nếu chưa đăng nhập → cho phép truy cập
 * - Nếu đã đăng nhập với role ADMIN → redirect /admin
 * - Nếu đã đăng nhập với role STAFF → redirect /staff
 * - Nếu đã đăng nhập với role khác → cho phép truy cập (để hiển thị lỗi)
 * 
 * @param {React.ReactNode} children - Component (LoginStaff form)
 * @returns {React.ReactNode}
 */
const StaffLoginRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    // Nếu chưa đăng nhập, cho phép truy cập
    if (!isAuthenticated) {
        return children;
    }

    // Lấy role từ user object
    const userRole = user?.role || user?.roles?.[0];

    // Nếu đã đăng nhập với role ADMIN, redirect về /admin
    if (userRole === ROLES.ADMIN) {
        return <Navigate to="/admin" replace />;
    }

    // Nếu đã đăng nhập với role STAFF, redirect về /staff
    if (userRole === ROLES.STAFF) {
        return <Navigate to="/staff" replace />;
    }

    // Các role khác (MEMBER, etc.) - cho phép truy cập để hiển thị thông báo lỗi
    return children;
};

export default StaffLoginRoute;