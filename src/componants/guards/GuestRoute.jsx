// ==========================================
// GuestRoute Guard
// Mô tả: Route guard cho pages chỉ dành cho guest (chưa đăng nhập)
// Vị trí: src/componants/guards/GuestRoute.jsx
// ==========================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * GuestRoute Component
 * 
 * Guard component cho routes chỉ dành cho guest user (Login, Register).
 * Nếu user đã đăng nhập, redirect về Homepage.
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
    const { isAuthenticated } = useAuth();

    // Nếu user đã đăng nhập, redirect về Homepage
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Guest user, cho phép truy cập Login/Register
    return children;
};

export default GuestRoute;
