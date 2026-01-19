import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Hook để sử dụng AuthContext
 * @returns {Object} - { user, isAuthenticated, isAdmin, loading, logout }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    const { user, isAuthenticated, isLoading, logout } = context;

    // Helper để kiểm tra admin
    const isAdmin = () => {
        if (!user) return false;
        const userRole = user.role || user.roleId;
        const userRoles = user.roles || [];
        return (
            userRole === 'ADMIN' ||
            userRole === 1 ||
            userRole === '1' ||
            (Array.isArray(userRoles) && userRoles.includes('ADMIN'))
        );
    };

    return {
        user,
        isAuthenticated,
        isAdmin: isAdmin(),
        loading: isLoading,
        logout,
    };
};

export default useAuth;
