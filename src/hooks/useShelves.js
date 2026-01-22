// ==========================================
// Hook: useShelves
// Quản lý state và API calls cho shelves
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import shelfService from '../services/shelf.service';

const useShelves = () => {
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ==========================================
    // Fetch all shelves
    // ==========================================
    const fetchShelves = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await shelfService.getShelves();
            setShelves(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Get shelf by ID
    // ==========================================
    const getById = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const data = await shelfService.getShelfById(id);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Create new shelf
    // ==========================================
    const create = useCallback(async (shelfData) => {
        setLoading(true);
        setError(null);

        try {
            const newShelf = await shelfService.createShelf(shelfData);
            setShelves(prev => [...prev, newShelf]);
            return newShelf;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Update shelf
    // ==========================================
    const update = useCallback(async (id, shelfData) => {
        setLoading(true);
        setError(null);

        try {
            const updated = await shelfService.updateShelf(id, shelfData);
            setShelves(prev => prev.map(s => s.id === id ? updated : s));
            return updated;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Delete shelf
    // ==========================================
    const remove = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            await shelfService.deleteShelf(id);
            setShelves(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-fetch on mount
    useEffect(() => {
        fetchShelves();
    }, [fetchShelves]);

    return {
        shelves,
        loading,
        error,
        fetchShelves,
        getById,
        create,
        update,
        remove,
    };
};

export default useShelves;
