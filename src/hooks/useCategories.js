// ==========================================
// Hook: useCategories
// Mô tả: Custom hook để fetch và quản lý categories
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/category.service';
import usePrefetch from './usePrefetch';

/**
 * Custom hook để quản lý categories
 * @returns {Object} - { categories, loading, error, refetch }
 */
const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { prefetch } = usePrefetch();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Sử dụng prefetch để cache danh sách categories
            const response = await prefetch('categories-all', () => categoryService.getAll());
            setCategories(Array.isArray(response) ? response : response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch categories');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, [prefetch]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
    };
};

/**
 * Custom hook để fetch category by ID
 * @param {string|number} id - Category ID
 * @returns {Object} - { category, loading, error, refetch }
 */
export const useCategoryDetail = (id) => {
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategory = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await categoryService.getById(id);
            setCategory(response);
        } catch (err) {
            setError(err.message || 'Failed to fetch category');
            setCategory(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    return {
        category,
        loading,
        error,
        refetch: fetchCategory,
    };
};

export default useCategories;
