import { useState, useCallback, useMemo } from 'react';

export default function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Tính toán total pages và current items
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }, [items.length, itemsPerPage]);
  
  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);
  
  const currentItems = useMemo(() => {
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, startIndex, itemsPerPage]);
  
  // Safe function để set current page
  const safeSetCurrentPage = useCallback((page) => {
    const pageNum = Number(page);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  }, [totalPages]);
  
  // Reset về trang 1
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  // Chuyển đến trang đầu/cuối
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);
  
  // Chuyển trang
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);
  
  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  return {
    // State
    currentPage,
    totalPages,
    currentItems,
    startIndex,
    itemsPerPage,
    
    // Functions
    setCurrentPage: safeSetCurrentPage,
    resetPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage
  };
}