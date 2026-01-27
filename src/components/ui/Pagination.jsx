// ==========================================
// Component: Pagination
// Mô tả: Thanh phân trang hiện đại với smooth UI/UX
// Vị trí: src/components/ui/Pagination.jsx
// ==========================================

import { ChevronLeft, ChevronRight } from 'lucide-react';

// ==========================================
// Props:
// - currentPage: number - Trang hiện tại (bắt đầu từ 1)
// - totalPages: number - Tổng số trang
// - onPageChange: function - Callback khi đổi trang
// - className: string - Class tùy chỉnh
// ==========================================

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    className = '',
}) => {
    // Không hiển thị nếu chỉ có 1 trang
    if (totalPages <= 1) return null;

    // ==========================================
    // Logic tạo danh sách số trang với dấu "..."
    // ==========================================
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;

        // Nếu tổng trang <= 7: hiển thị tất cả
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Logic hiển thị với dấu "..." thông minh
        const leftSiblings = 1;
        const rightSiblings = 1;

        const leftSiblingIndex = Math.max(currentPage - leftSiblings, 1);
        const rightSiblingIndex = Math.min(currentPage + rightSiblings, totalPages);

        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPages - 1;

        // Luôn hiển thị trang đầu
        pages.push(1);

        // Dots bên trái hoặc các trang giữa 1 và leftSiblingIndex
        if (showLeftDots) {
            pages.push('...');
        } else {
            for (let i = 2; i < leftSiblingIndex; i++) {
                pages.push(i);
            }
        }

        // Các trang xung quanh trang hiện tại
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }

        // Dots bên phải hoặc các trang giữa rightSiblingIndex và totalPages
        if (showRightDots) {
            pages.push('...');
        } else {
            for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
                pages.push(i);
            }
        }

        // Luôn hiển thị trang cuối
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    // ==========================================
    // Event Handlers
    // ==========================================
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange?.(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange?.(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if (page !== currentPage && typeof page === 'number') {
            onPageChange?.(page);
        }
    };

    const pageNumbers = getPageNumbers();

    // ==========================================
    // Render
    // ==========================================
    return (
        <nav
            className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}
            aria-label="Pagination"
        >
            {/* Previous Button */}
            <button
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`
                    flex items-center justify-center
                    w-9 h-9 sm:w-10 sm:h-10
                    rounded-full
                    text-text-primary
                    transition-all duration-300 ease-out
                    hover:bg-primary/10 hover:text-primary
                    active:scale-95
                    cursor-pointer disabled:cursor-not-allowed
                    disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-primary
                `}
                aria-label="Trang trước"
            >
                <ChevronLeft size={20} strokeWidth={2} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    // Dấu ba chấm
                    if (page === '...') {
                        return (
                            <span
                                key={`dots-${index}`}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-text-sub select-none"
                            >
                                •••
                            </span>
                        );
                    }

                    // Nút số trang
                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => handlePageClick(page)}
                            className={`
                                flex items-center justify-center
                                w-9 h-9 sm:w-10 sm:h-10
                                rounded-full
                                text-sm font-medium
                                transition-all duration-300 ease-out
                                active:scale-95
                                cursor-pointer
                                ${isActive
                                    ? 'bg-primary text-white scale-110 shadow-md shadow-primary/30'
                                    : 'text-text-primary hover:bg-primary/10 hover:text-primary'
                                }
                            `}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`Trang ${page}`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`
                    flex items-center justify-center
                    w-9 h-9 sm:w-10 sm:h-10
                    rounded-full
                    text-text-primary
                    transition-all duration-300 ease-out
                    hover:bg-primary/10 hover:text-primary
                    active:scale-95
                    cursor-pointer disabled:cursor-not-allowed
                    disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-primary
                `}
                aria-label="Trang sau"
            >
                <ChevronRight size={20} strokeWidth={2} />
            </button>
        </nav>
    );
};

export default Pagination;
