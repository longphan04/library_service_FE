// ==========================================
// Component: BookSection
// Mô tả: Section hiển thị danh sách sách theo thể loại với carousel
// Vị trí: src/components/ui/BookSection.jsx
// ==========================================

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import BookCard from './BookCard';

// ==========================================
// Props:
// - title: string - Tiêu đề section (VD: "Hot list", "Trinh Thám")
// - books: array - Danh sách sách
// - viewAllLink: string - Link xem tất cả
// - className: string - Class tùy chỉnh
// ==========================================

const BookSection = ({
    title,
    books = [],
    viewAllLink = '#',
    className = '',
}) => {
    const scrollContainerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Số sách hiển thị trên mỗi trang (responsive)
    const booksPerPage = 6;
    const totalPages = Math.ceil(books.length / booksPerPage);

    // Scroll to specific page
    const scrollToPage = (pageIndex) => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: containerWidth * pageIndex,
                behavior: 'smooth',
            });
            setCurrentPage(pageIndex);
        }
    };

    // Handle scroll event to update current page
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.offsetWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const newPage = Math.round(scrollLeft / containerWidth);
            setCurrentPage(newPage);
        }
    };

    // Navigate to previous/next page
    const goToPrevPage = () => {
        if (currentPage > 0) {
            scrollToPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            scrollToPage(currentPage + 1);
        }
    };

    return (
        <section className={`bg-bg-section rounded-2xl p-6 ${className}`}>
            {/* Section Header */}
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

            {/* Books Carousel Container */}
            <div className="relative">
                {/* Navigation Buttons */}
                {totalPages > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goToPrevPage}
                            disabled={currentPage === 0}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-2 rounded-full bg-white shadow-md text-text-primary hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            aria-label="Trang trước"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages - 1}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 p-2 rounded-full bg-white shadow-md text-text-primary hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            aria-label="Trang sau"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Scrollable Books Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {books.map((book) => {
                        const bookId = book.book_id || book.id || book._id;
                        const coverImage = book.cover_url || book.coverImage || book.image || book.thumbnail || 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=No+Image';
                        return (
                            <BookCard
                                key={bookId}
                                id={bookId}
                                coverImage={coverImage}
                                title={book.title}
                                author={book.author}
                                className="w-[140px] sm:w-[160px] snap-start"
                            />
                        );
                    })}
                </div>
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => scrollToPage(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentPage === index
                                ? 'bg-text-primary scale-110'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Trang ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default BookSection;
