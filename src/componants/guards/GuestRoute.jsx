// ==========================================
// GuestRoute Guard
// Mô tả: Route guard cho pages chỉ dành cho guest (chưa đăng nhập)
// Vị trí: src/componants/guards/GuestRoute.jsx
// ==========================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRedirectByRole } from '../../constants/roles';

/**
 * GuestRoute Component
 * 
 * Guard component cho routes chỉ dành cho guest user (Login, Register).
 * Nếu user đã đăng nhập, redirect về dashboard theo role.
 * 
 * @param {React.ReactNode} children - Component (Login/Register form)
 * @returns {React.ReactNode} - Children nếu guest, Navigate nếu đã login
 * 
 * @example
 * <GuestRoute>
 *   <Login />
 * </GuestRoute>
 */
const GuestRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    // Nếu user đã đăng nhập, redirect về dashboard theo role
    if (isAuthenticated) {
        const userRole = user?.role || user?.roles?.[0];
        const redirectPath = getRedirectByRole(userRole);
        return <Navigate to={redirectPath} replace />;
    }

    // Guest user, cho phép truy cập Login/Register
    return children;
};

export default GuestRoute;
