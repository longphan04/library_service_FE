// ==========================================
// Component: BookSection
// Mô tả: Section hiển thị danh sách sách theo thể loại
// 
// Layout:
//   - Cố định 1 hàng = 6 quyển sách (responsive: 2→3→4→6)
//   - Nếu có nhiều hơn 6 sách → Pagination dots ở giữa
//   - Click pagination để chuyển trang
//
// Vị trí: src/components/ui/BookSection.jsx
// ==========================================

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCardUser';
import { FALLBACK_IMAGES } from '../../utils/imageUrl';

// ==========================================
// Hằng số
// ==========================================

/** Số sách hiển thị mỗi trang */
const BOOKS_PER_PAGE = 6;

// ==========================================
// Props:
// - title: string - Tiêu đề section
// - books: array - Danh sách sách
// - viewAllLink: string - Link xem tất cả
// - className: string - Class tùy chỉnh
// ==========================================

const BookSection = ({
    title,
    books = [],
    viewAllLink = '#',
    className = '',
    onBookClick,
    itemsPerPage = 6, // Default to 6, configurable to 18
    emptyMessage = 'Chưa có sách trong danh mục này',
    isLoading = false,
}) => {
    // ==========================================
    // State: Trang hiện tại
    // ==========================================
    const [currentPage, setCurrentPage] = useState(0);

    // Reset về trang 1 khi books thay đổi (đổi category)
    useEffect(() => {
        setCurrentPage(0);
    }, [books]);

    // ==========================================
    // Tính toán số trang và sách hiển thị
    // ==========================================
    const totalPages = useMemo(() => {
        if (isLoading) return 1; // 1 page of skeletons
        return Math.ceil(books.length / itemsPerPage);
    }, [books.length, itemsPerPage, isLoading]);

    // Lấy sách của trang hiện tại
    const currentBooks = useMemo(() => {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return books.slice(start, end);
    }, [books, currentPage, itemsPerPage]);

    // ==========================================
    // Handlers
    // ==========================================

    const goToPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const goToPrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <section className={`bg-bg-section rounded-2xl p-6 ${className}`}>
            {/* ========================================== */}
            {/* Section Header */}
            {/* ========================================== */}
            {/* ========================================== */}
            {/* Section Header */}
            {/* ========================================== */}
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary">
                        {title}
                    </h2>
                    <Link
                        to={viewAllLink}
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                        Xem tất cả
                        <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {/* ========================================== */}
            {/* Books Grid - Cố định 6 sách mỗi hàng */}
            {/* ========================================== */}
            <div className="relative">
                {isLoading ? (
                    // Skeleton Grid
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                        {Array.from({ length: itemsPerPage }).map((_, i) => (
                            <div key={i} className="bg-white rounded-lg p-2 shadow-sm space-y-2">
                                <div className="aspect-3/4 w-full bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Navigation Arrows - chỉ hiển thị khi có nhiều trang */}
                        {totalPages > 1 && (
                            <>
                                {/* Nút Previous */}
                                <button
                                    type="button"
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 0}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-md text-text-primary hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    aria-label="Trang trước"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* Nút Next */}
                                <button
                                    type="button"
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages - 1}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-md text-text-primary hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    aria-label="Trang sau"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* Grid sách - responsive */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                            {currentBooks.map((book) => {
                                const bookId = book.book_id || book.id || book._id;
                                const coverImage = book.cover_url || book.coverImage || book.image || book.thumbnail || FALLBACK_IMAGES.bookPlaceholder;
                                return (
                                    <BookCard
                                        key={bookId}
                                        id={bookId}
                                        coverImage={coverImage}
                                        title={book.title}
                                        author={book.author}
                                        onClick={onBookClick}
                                        className="h-full"
                                    />
                                );
                            })}

                            {/* Empty Placeholders (Filled up to itemsPerPage) */}
                            {Array.from({ length: Math.max(0, itemsPerPage - currentBooks.length) }).map((_, index) => (
                                <BookCard
                                    key={`placeholder-${index}`}
                                    id={`placeholder-${index}`}
                                    coverImage={FALLBACK_IMAGES.bookPlaceholder}
                                    title="Placeholder"
                                    author="Placeholder"
                                    className="invisible pointer-events-none h-full"
                                />
                            ))}
                        </div>

                        {/* Empty Message Overlay */}
                        {currentBooks.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                <p className="text-text-sub text-lg font-medium">{emptyMessage}</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ========================================== */}
            {/* Pagination Dots - Ở giữa */}
            {/* Chỉ hiển thị khi có nhiều hơn 1 trang */}
            {/* ========================================== */}
            {/* ========================================== */}
            {/* Pagination Dots - Ở giữa */}
            {/* Luôn giữ khoảng trống (min-h) để tránh giật layout khi số trang thay đổi */}
            {/* ========================================== */}
            <div className={`flex justify-center items-center gap-2 mt-6 h-2.5 ${totalPages > 1 ? '' : 'invisible'}`}>
                {Array.from({ length: Math.max(1, totalPages) }).map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => goToPage(index)}
                        className={`
                            w-2.5 h-2.5 rounded-full transition-all duration-200
                            ${currentPage === index
                                ? 'bg-primary scale-125'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }
                        `}
                        aria-label={`Trang ${index + 1}`}
                        aria-current={currentPage === index ? 'page' : undefined}
                        tabIndex={totalPages > 1 ? 0 : -1}
                    />
                ))}
            </div>
        </section>
    );
};

export default BookSection;
