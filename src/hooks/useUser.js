// ==========================================
// Hook: useUser
// Mô tả: Custom hook để quản lý user profile
// ==========================================

import { useState, useCallback } from 'react';
import userService from '../services/user.service';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook để quản lý user profile
 * @returns {Object} - { user, loading, error, updateProfile, refetch }
 */
const useUser = () => {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Lấy thông tin user từ API
     */
    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userService.getMe();
            return response;
        } catch (err) {
            setError(err.message || 'Failed to fetch user');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Cập nhật thông tin user
     * @param {Object} data - User data to update
     */
    const updateProfile = useCallback(async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await userService.updateMe(data);
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(response));
            return response;
        } catch (err) {
            setError(err.message || 'Failed to update profile');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user: authUser,
        loading,
        error,
        updateProfile,
        refetch: fetchUser,
    };
};

export default useUser;
