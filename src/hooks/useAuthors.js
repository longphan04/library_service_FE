// ==========================================
// Hook: useAuthors
// Mô tả: Custom hook để fetch và quản lý authors
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import authorService from '../services/author.service';

/**
 * Custom hook để quản lý authors
 * @returns {Object} - { authors, loading, error, refetch }
 */
const useAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAuthors = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await authorService.getAll();
            setAuthors(Array.isArray(response) ? response : response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch authors');
            setAuthors([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    return {
        authors,
        loading,
        error,
        refetch: fetchAuthors,
    };
};

/**
 * Custom hook để fetch author by ID
 * @param {string|number} id - Author ID
 * @returns {Object} - { author, loading, error, refetch }
 */
export const useAuthorDetail = (id) => {
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAuthor = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authorService.getById(id);
            setAuthor(response);
        } catch (err) {
            setError(err.message || 'Failed to fetch author');
            setAuthor(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAuthor();
    }, [fetchAuthor]);

    return {
        author,
        loading,
        error,
        refetch: fetchAuthor,
    };
};

export default useAuthors;
