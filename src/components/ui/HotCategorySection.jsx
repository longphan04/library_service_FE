// ==========================================
// Component: HotCategorySection
// Mô tả: Section hiển thị 3 danh mục nổi bật với hình ảnh
// 
// Chức năng:
//   - Hiển thị 3 hot categories từ API /category/hot
//   - Click category → Hiển thị sách tương ứng bên dưới
//   - Nút "Xem tất cả" chuyển đến trang danh mục
//   - Tất cả trong cùng 1 section, không navigate khi chọn category
//
// Vị trí: src/components/ui/HotCategorySection.jsx
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import Spinner from './Spinner';
import categoryService from '@/services/category.service';
import bookService from '@/services/book.service';
import { FALLBACK_IMAGES, getBookCoverUrl, getCategoryImageUrl } from '@/utils/imageUrl';

// ... (constants remaining same, skipped in replacement content if not needed, but I will include full file context for safety or target logic blocks)

/** Số sách tối đa hiển thị mỗi category */
const BOOKS_LIMIT = 6;

/** Ảnh mặc định khi category không có ảnh */
const DEFAULT_CATEGORY_IMAGE = FALLBACK_IMAGES.categoryPlaceholder;

// ... (CategoryCard & HotCategorySkeleton remaining same)

const CategoryCard = ({ category, isActive, onClick }) => {
    // Lấy URL ảnh với fallback - sử dụng getCategoryImageUrl utility
    const imageUrl = getCategoryImageUrl(
        category.image || category.cover_url || category.coverImage
    );

    return (
        <button
            onClick={() => onClick(category)}
            className={`
                relative group overflow-hidden rounded-xl w-full
                transition-all duration-300
                ${isActive
                    ? 'ring-4 ring-primary shadow-lg scale-[1.02]'
                    : 'hover:shadow-md hover:scale-[1.01]'
                }
            `}
        >
            {/* Ảnh category */}
            <div className="aspect-3/2 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_CATEGORY_IMAGE;
                    }}
                />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            {/* Tên category */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg truncate">
                    {category.name}
                </h3>
                {category.bookCount > 0 && (
                    <p className="text-white/80 text-sm">
                        {category.bookCount} cuốn sách
                    </p>
                )}
            </div>
        </button>
    );
};

const HotCategorySkeleton = () => (
    <section className="bg-bg-section rounded-2xl p-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-border rounded animate-pulse" />
                <div className="h-6 bg-border rounded w-40 animate-pulse" />
            </div>
            <div className="h-4 bg-border rounded w-20 animate-pulse" />
        </div>

        {/* Category cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-3/2 bg-border rounded-xl" />
                </div>
            ))}
        </div>
    </section>
);

const HotCategorySection = ({ className = '' }) => {
    // ==========================================
    // Hooks
    // ==========================================
    const navigate = useNavigate();

    // ==========================================
    // State
    // ==========================================

    /** Danh sách 3 hot categories từ API */
    const [hotCategories, setHotCategories] = useState([]);

    /** Category đang được chọn */
    const [selectedCategory, setSelectedCategory] = useState(null);

    /** Danh sách sách của category đang chọn */
    const [books, setBooks] = useState([]);

    /** Pagination State */
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    /** Loading states */
    const [loading, setLoading] = useState(true);
    const [booksLoading, setBooksLoading] = useState(false);

    /** Error state */
    const [error, setError] = useState(null);

    // ==========================================
    // Fetch Hot Categories
    // ==========================================

    const fetchHotCategories = useCallback(async () => {
        try {
            // Gọi API lấy hot categories
            const response = await categoryService.getHotCategories();
            const data = Array.isArray(response) ? response : response.data || [];

            // Chuẩn hóa dữ liệu - lấy 4 categories (theo yêu cầu mới)
            const normalizedCategories = data.slice(0, 4).map(cat => ({
                id: cat.id || cat._id || cat.category_id,
                name: cat.name,
                image: getCategoryImageUrl(cat.image || cat.cover_url || cat.coverImage),
                bookCount: cat.bookCount || cat.booksCount || 0,
            }));

            setHotCategories(normalizedCategories);

            // Tự động chọn category đầu tiên nếu danh sách không rỗng
            if (normalizedCategories.length > 0) {
                // Chỉ chọn nếu chưa có category nào được chọn (tránh override khi re-fetch)
                setSelectedCategory(prev => prev || normalizedCategories[0]);
            }
        } catch (err) {
            console.error('Lỗi khi tải hot categories:', err);
            setError(err.message || 'Không thể tải danh mục nổi bật');
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Effects
    // ==========================================

    // Fetch initial data
    useEffect(() => {
        fetchHotCategories();
    }, [fetchHotCategories]);

    // Fetches books when a category is selected or page changes
    useEffect(() => {
        const fetchBooks = async () => {
            if (!selectedCategory) return;
            setBooksLoading(true);
            try {
                const response = await bookService.getAll({
                    categoryId: selectedCategory.id,
                    limit: BOOKS_LIMIT,
                    page: currentPage
                });

                // Handle different response structures
                const data = response.books || response.data || [];
                const total = response.totalPages || (response.total ? Math.ceil(response.total / BOOKS_LIMIT) : 0) || 1;

                setBooks(data);
                setTotalPages(total);
            } catch (err) {
                console.error('Error fetching books:', err);
                setBooks([]);
            } finally {
                setBooksLoading(false);
            }
        };

        fetchBooks();
    }, [selectedCategory, currentPage]);

    const handleCategoryClick = (category) => {
        if (selectedCategory?.id !== category.id) {
            setSelectedCategory(category);
            setCurrentPage(1); // Reset page when category changes
        }
    };

    // Pagination Handlers
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    if (loading) {
        return <HotCategorySkeleton />;
    }

    if (error) {
        // Fallback or empty if error, or just show section with error
        return null;
    }

    return (
        <section className={`bg-bg-section rounded-2xl p-6 ${className}`}>
            {/* ========================================== */}
            {/* Header */}
            {/* ========================================== */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="text-primary">
                        <Flame size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">
                        Danh mục nổi bật
                    </h2>
                </div>
            </div>

            {/* ========================================== */}
            {/* Hot Category Cards */}
            {/* 4 hình ảnh đại diện cho 4 danh mục */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {hotCategories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        isActive={selectedCategory?.id === category.id}
                        onClick={handleCategoryClick}
                    />
                ))}
            </div>

            {/* ========================================== */}
            {/* Books Display */}
            {/* Hiển thị sách khi user đã chọn 1 category */}
            {/* ========================================== */}
            {
                selectedCategory && (
                    <div className="mt-6 pt-6 border-t border-border">
                        {booksLoading ? (
                            /* Loading spinner */
                            <div className="flex justify-center py-8">
                                <Spinner size="lg" />
                            </div>
                        ) : books.length > 0 ? (
                            /* Books Grid */
                            <div>
                                {/* Tiêu đề section sách */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-text-primary">
                                        Sách {selectedCategory.name}
                                    </h3>
                                    <Link
                                        to={`/search?category=${selectedCategory.id}`}
                                        className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                                    >
                                        Xem tất cả
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {/* Grid sách - 6 columns trên desktop */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                    {books.map((book) => {
                                        const bookId = book.id || book.book_id || book._id;
                                        const handleBookClick = (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/books/${bookId}`);
                                        };

                                        return (
                                            <div
                                                key={bookId}
                                                onClick={handleBookClick}
                                                className="group cursor-pointer"
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleBookClick(e);
                                                    }
                                                }}
                                            >
                                                {/* Book Cover */}
                                                <div className="aspect-3/4 overflow-hidden rounded-lg mb-2 bg-border">
                                                    <img
                                                        src={getBookCoverUrl(book.cover_url || book.coverImage || book.image)}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = FALLBACK_IMAGES.bookPlaceholder;
                                                        }}
                                                    />
                                                </div>
                                                {/* Book Info */}
                                                <h4 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                                                    {book.title}
                                                </h4>
                                                <p className="text-xs text-text-sub mt-1 truncate">
                                                    {book.author}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-6">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-full hover:bg-bg-hover text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Previous page"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>

                                        <span className="text-sm font-medium text-text-secondary">
                                            Trang {currentPage} / {totalPages}
                                        </span>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-full hover:bg-bg-hover text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Next page"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Empty state */
                            <div className="text-center py-8 text-text-sub">
                                <p>Chưa có sách trong danh mục này</p>
                            </div>
                        )}
                    </div>
                )
            }
        </section >
    );
};

export default HotCategorySection;
