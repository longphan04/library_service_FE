// ==========================================
// Hook: usePublishers
// Mô tả: Custom hook để fetch và quản lý publishers
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import publisherService from '../services/publisher.service';

/**
 * Custom hook để quản lý publishers
 * @returns {Object} - { publishers, loading, error, refetch }
 */
const usePublishers = () => {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPublishers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await publisherService.getAll();
            setPublishers(Array.isArray(response) ? response : response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch publishers');
            setPublishers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPublishers();
    }, [fetchPublishers]);

    return {
        publishers,
        loading,
        error,
        refetch: fetchPublishers,
    };
};

/**
 * Custom hook để fetch publisher by ID
 * @param {string|number} id - Publisher ID
 * @returns {Object} - { publisher, loading, error, refetch }
 */
export const usePublisherDetail = (id) => {
    const [publisher, setPublisher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPublisher = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await publisherService.getById(id);
            setPublisher(response);
        } catch (err) {
            setError(err.message || 'Failed to fetch publisher');
            setPublisher(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPublisher();
    }, [fetchPublisher]);

    return {
        publisher,
        loading,
        error,
        refetch: fetchPublisher,
    };
};

export default usePublishers;
