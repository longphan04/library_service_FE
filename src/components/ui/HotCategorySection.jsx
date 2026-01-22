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
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import Spinner from './Spinner';
import categoryService from '../../services/category.service';
import bookService from '../../services/book.service';
import { FALLBACK_IMAGES, getBookCoverUrl, getCategoryImageUrl } from '../../utils/imageUrl';

// ==========================================
// Hằng số
// ==========================================

/** Số sách tối đa hiển thị mỗi category */
const BOOKS_LIMIT = 6;

/** Ảnh mặc định khi category không có ảnh */
const DEFAULT_CATEGORY_IMAGE = FALLBACK_IMAGES.categoryPlaceholder;

// ==========================================
// Component: CategoryCard (Internal)
// Mô tả: Card hiển thị 1 hot category với ảnh và tên
// ==========================================

const CategoryCard = ({ category, isActive, onClick }) => {
    // Lấy URL ảnh với fallback
    const imageUrl = category.image
        || category.cover_url
        || category.coverImage
        || DEFAULT_CATEGORY_IMAGE;

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

            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    Đang xem
                </div>
            )}
        </button>
    );
};

// ==========================================
// Component: HotCategorySkeleton (Internal)
// Mô tả: Skeleton loading cho hot categories
// ==========================================

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

// ==========================================
// Component: HotCategorySection (Main)
// ==========================================

const HotCategorySection = ({ className = '' }) => {
    // ==========================================
    // State
    // ==========================================

    /** Danh sách 3 hot categories từ API */
    const [hotCategories, setHotCategories] = useState([]);

    /** Category đang được chọn */
    const [selectedCategory, setSelectedCategory] = useState(null);

    /** Danh sách sách của category đang chọn */
    const [books, setBooks] = useState([]);

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

            // Chuẩn hóa dữ liệu - chỉ lấy 3 categories
            const normalizedCategories = data.slice(0, 3).map(cat => ({
                id: cat.id || cat._id || cat.category_id,
                name: cat.name,
                image: cat.image || cat.cover_url || cat.coverImage,
                bookCount: cat.bookCount || cat.booksCount || 0,
            }));

            setHotCategories(normalizedCategories);

            // Không tự động chọn category - để user click
        } catch (err) {
            console.error('Lỗi khi tải hot categories:', err);
            setError(err.message || 'Không thể tải danh mục nổi bật');
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Fetch Books theo Category
    // ==========================================

    const fetchBooksByCategory = useCallback(async (categoryId) => {
        if (!categoryId) return;

        setBooksLoading(true);
        try {
            const response = await bookService.getAll({
                categoryId: categoryId,  // Backend nhận param "categoryId"
                limit: BOOKS_LIMIT,
            });

            const booksData = Array.isArray(response) ? response : response.data || [];

            // Chuẩn hóa dữ liệu sách
            const normalizedBooks = booksData.map(book => ({
                id: book.book_id || book.id || book._id,
                title: book.title,
                author: book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ',
                coverImage: book.cover_url || book.coverImage || book.image || book.thumbnail,
            }));

            setBooks(normalizedBooks);
        } catch (err) {
            console.error('Lỗi khi tải sách:', err);
            setBooks([]);
        } finally {
            setBooksLoading(false);
        }
    }, []);

    // ==========================================
    // Effects
    // ==========================================

    // Fetch initial data
    useEffect(() => {
        fetchHotCategories();
    }, [fetchHotCategories]);

    // Fetch books khi selected category thay đổi
    useEffect(() => {
        if (selectedCategory) {
            fetchBooksByCategory(selectedCategory.id);
        }
    }, [selectedCategory, fetchBooksByCategory]);

    // ==========================================
    // Handlers
    // ==========================================

    /**
     * Xử lý khi click vào hot category card
     */
    const handleCategoryClick = (category) => {
        // Nếu click vào category đang active → bỏ chọn
        if (selectedCategory?.id === category.id) {
            setSelectedCategory(null);
            setBooks([]);
        } else {
            setSelectedCategory(category);
        }
    };

    // ==========================================
    // Render: Loading State
    // ==========================================

    if (loading) {
        return <HotCategorySkeleton />;
    }

    // ==========================================
    // Render: Error State
    // ==========================================

    if (error && hotCategories.length === 0) {
        return (
            <section className={`bg-bg-section rounded-2xl p-6 ${className}`}>
                <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchHotCategories}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                    >
                        Thử lại
                    </button>
                </div>
            </section>
        );
    }

    // ==========================================
    // Render: Main
    // ==========================================

    return (
        <section className={`bg-bg-section rounded-2xl p-6 ${className}`}>
            {/* ========================================== */}
            {/* Section Header */}
            {/* ========================================== */}
            <div className="flex items-center justify-between mb-6">
                {/* Title */}
                <div className="flex items-center gap-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <h2 className="text-xl font-bold text-text-primary">
                        Danh Mục Nổi Bật
                    </h2>
                </div>

                {/* Xem tất cả → Chuyển đến trang danh mục */}
                <Link
                    to="/categories"
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
                >
                    Xem tất cả
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* ========================================== */}
            {/* Hot Category Cards */}
            {/* 3 hình ảnh đại diện cho 3 danh mục */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            {selectedCategory && (
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
                                {books.map((book) => (
                                    <Link
                                        key={book.id}
                                        to={`/books/${book.id}`}
                                        className="group"
                                    >
                                        {/* Book Cover */}
                                        <div className="aspect-3/4 overflow-hidden rounded-lg mb-2 bg-border">
                                            <img
                                                src={book.coverImage || FALLBACK_IMAGES.bookPlaceholder}
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
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="text-center py-8 text-text-sub">
                            <p>Chưa có sách trong danh mục này</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default HotCategorySection;
