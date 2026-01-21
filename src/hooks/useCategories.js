// ==========================================
// Hook: useCategories
// Mô tả: Custom hook để fetch và quản lý categories
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/category.service';

/**
 * Custom hook để quản lý categories
 * @returns {Object} - { categories, loading, error, refetch }
 */
const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await categoryService.getAll();

            // DEBUG: Log API response thô để xem tên trường dữ liệu
            console.log('[useCategories] 📥 Raw API response:', response);

            const rawCategories = Array.isArray(response) ? response : response.data || [];

            // DEBUG: Log thử 1 category để xem cấu trúc
            if (rawCategories.length > 0) {
                console.log('[useCategories] 📋 Các trường dữ liệu:', Object.keys(rawCategories[0]));
                console.log('[useCategories] 📋 Dữ liệu mẫu:', rawCategories[0]);
            }

            // Chuẩn hóa dữ liệu category để đồng nhất id và số lượng sách
            // Xử lý trường hợp API trả về tên trường khác nhau (ví dụ: bookCount, booksCount...)
            const normalizedCategories = rawCategories.map(cat => ({
                ...cat,
                id: cat.id || cat._id || cat.category_id,
                // Lấy số lượng sách từ các tên biến có thể có
                bookCount: cat.bookCount || cat.booksCount || cat.books_count || cat.book_count || cat.totalBooks || cat.total_books || 0,
            }));

            console.log('[useCategories] ✅ Dữ liệu sau khi chuẩn hóa:', normalizedCategories);

            setCategories(normalizedCategories);
        } catch (err) {
            console.error('[useCategories] ❌ Error:', err);
            setError(err.message || 'Failed to fetch categories');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

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
