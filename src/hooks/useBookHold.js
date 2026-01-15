// ==========================================
// Hook: useBookHold
// Mô tả: Custom hook để quản lý book holds (đặt trước sách)
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import bookHoldService from '../services/book-hold.service';

/**
 * Custom hook để quản lý book holds của user
 * @returns {Object} - { holds, loading, error, createHold, removeHold, refetch }
 */
const useBookHold = () => {
    const [holds, setHolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchHolds = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await bookHoldService.getMyHolds();
            setHolds(Array.isArray(response) ? response : response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch book holds');
            setHolds([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHolds();
    }, [fetchHolds]);

    /**
     * Đặt trước sách
     * @param {Object} data - { bookId }
     */
    const createHold = useCallback(async (data) => {
        setActionLoading(true);
        setError(null);

        try {
            const newHold = await bookHoldService.create(data);
            setHolds((prev) => [newHold, ...prev]);
            return newHold;
        } catch (err) {
            setError(err.message || 'Failed to create book hold');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, []);

    /**
     * Hủy đặt trước sách
     * @param {string|number} id - Book hold ID
     */
    const removeHold = useCallback(async (id) => {
        setActionLoading(true);
        setError(null);

        try {
            await bookHoldService.remove(id);
            setHolds((prev) => prev.filter((hold) => hold.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to remove book hold');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, []);

    /**
     * Kiểm tra sách đã được đặt chưa
     * @param {string|number} bookId 
     * @returns {boolean}
     */
    const isBookOnHold = useCallback((bookId) => {
        return holds.some((hold) => hold.bookId === bookId || hold.book?.id === bookId);
    }, [holds]);

    return {
        holds,
        loading,
        error,
        actionLoading,
        createHold,
        removeHold,
        isBookOnHold,
        refetch: fetchHolds,
    };
};

export default useBookHold;
