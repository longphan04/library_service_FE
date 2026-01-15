// ==========================================
// Hook: useBooks
// Mô tả: Custom hook để fetch và quản lý books với URL query sync
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import bookService from '../services/book.service';

/**
 * Custom hook để quản lý books với URL query params sync
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - { books, loading, error, filters, setFilters, pagination, refetch }
 */
const useBooks = (initialFilters = {}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse initial filters từ URL
    const getFiltersFromURL = useCallback(() => {
        return {
            category: searchParams.get('category') || initialFilters.category || '',
            keyword: searchParams.get('keyword') || initialFilters.keyword || '',
            sort: searchParams.get('sort') || initialFilters.sort || '',
            page: parseInt(searchParams.get('page')) || initialFilters.page || 1,
            limit: parseInt(searchParams.get('limit')) || initialFilters.limit || 12,
        };
    }, [searchParams, initialFilters]);

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFiltersState] = useState(getFiltersFromURL);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
    });

    // Sync filters với URL
    const setFilters = useCallback((newFilters) => {
        const updatedFilters = typeof newFilters === 'function'
            ? newFilters(filters)
            : { ...filters, ...newFilters };

        setFiltersState(updatedFilters);

        // Update URL params
        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== 1) {
                params.set(key, value);
            }
        });
        setSearchParams(params, { replace: true });
    }, [filters, setSearchParams]);

    // Fetch books
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await bookService.getAll(filters);

            // Handle different API response formats
            if (Array.isArray(response)) {
                setBooks(response);
                setPagination({ page: 1, totalPages: 1, total: response.length });
            } else {
                setBooks(response.data || response.books || []);
                setPagination({
                    page: response.page || filters.page || 1,
                    totalPages: response.totalPages || Math.ceil((response.total || 0) / (filters.limit || 12)),
                    total: response.total || 0,
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch books');
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Fetch on mount and filter change
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Sync URL changes to state
    useEffect(() => {
        const urlFilters = getFiltersFromURL();
        const isDifferent = Object.keys(urlFilters).some(
            key => urlFilters[key] !== filters[key]
        );
        if (isDifferent) {
            setFiltersState(urlFilters);
        }
    }, [searchParams]);

    return {
        books,
        loading,
        error,
        filters,
        setFilters,
        pagination,
        refetch: fetchBooks,
    };
};

export default useBooks;
