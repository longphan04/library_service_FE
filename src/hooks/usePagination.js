import { useState, useMemo, useCallback } from 'react';

/**
 * usePagination - Hook for pagination logic
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Pagination state and methods
 */
export default function usePagination(items = [], itemsPerPage = 10) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() =>
        Math.max(1, Math.ceil(items.length / itemsPerPage)),
        [items.length, itemsPerPage]
    );

    const startIndex = useMemo(() =>
        (currentPage - 1) * itemsPerPage,
        [currentPage, itemsPerPage]
    );

    const currentItems = useMemo(() =>
        items.slice(startIndex, startIndex + itemsPerPage),
        [items, startIndex, itemsPerPage]
    );

    const resetPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const goToFirstPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const goToLastPage = useCallback(() => {
        setCurrentPage(totalPages);
    }, [totalPages]);

    const goToNextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const goToPrevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    return {
        currentPage,
        totalPages,
        currentItems,
        startIndex,
        itemsPerPage,
        setCurrentPage,
        resetPage,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPrevPage,
    };
}
