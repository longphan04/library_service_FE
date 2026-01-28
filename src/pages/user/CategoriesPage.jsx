// ==========================================
// Page: CategoriesPage (Refactored - Clean Architecture)
// Mô tả: Trang danh mục sách với:
//   - Separation of Concerns (logic tách vào custom hooks)
//   - Race Condition handling
//   - Caching (không gọi lại API nếu đã có dữ liệu)
//   - useMemo cho pagination logic
//   - useEffect cho smooth scroll
//
// Vị trí: src/pages/user/CategoriesPage.jsx
// ==========================================

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// [CHANGE] Import Layout Components
// ==========================================
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';

// ==========================================
// [CHANGE] Import UI Components
// ==========================================
import CategoryCard from '../../components/ui/CategoryCard';
import BookSection from '../../components/ui/BookSection';
import BookDetailModal from '../../components/ui/BookDetailModal';
import FloatingChatButton from '../../components/ui/FloatingChatButton';

// ==========================================
// [CHANGE] Import Custom Hooks (Clean Architecture)
// ==========================================
import useCategories from '../../hooks/useCategories';
import useBooksByCategory from '../../hooks/useBooksByCategory';

// ==========================================
// Constants
// ==========================================

/** Số lượng category hiển thị mỗi trang (2 hàng x 4 cột) */
const ITEMS_PER_PAGE = 8;

// ==========================================
// CategoriesPage Component
// ==========================================
const CategoriesPage = () => {
    // ==========================================
    // Navigation
    // ==========================================
    const navigate = useNavigate();

    // ==========================================
    // [CHANGE] Custom Hooks - Separation of Concerns
    // Logic fetch được tách ra hooks, component chỉ lo UI
    // ==========================================

    /** Hook quản lý danh sách categories */
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError
    } = useCategories();

    /** 
     * [CHANGE] Hook quản lý sách theo category
     * Bao gồm: caching, race condition handling, data normalization
     */
    const {
        books: categoryBooks,
        loading: booksLoading,
        error: booksError,
        selectedCategoryId,
        fetchBooks,
        clearSelection,
    } = useBooksByCategory(18); // Limit 18 sách (3 trang slide)

    // ==========================================
    // Local State - UI Only
    // ==========================================

    /** Trang hiện tại của category carousel */
    const [currentPage, setCurrentPage] = useState(0);

    /** Category object đang được chọn (để hiển thị tên) */
    const [selectedCategory, setSelectedCategory] = useState(null);

    /** Ref để scroll đến books section */
    const booksRef = useRef(null);

    // ==========================================
    // [CHANGE] useMemo - Performance Optimization
    // Tính toán pagination chỉ khi categories thay đổi
    // ==========================================

    /** Tổng số trang */
    const totalPages = useMemo(() => {
        return Math.ceil((categories?.length || 0) / ITEMS_PER_PAGE);
    }, [categories?.length]);

    /** Danh sách category cho trang hiện tại */
    const currentPageCategories = useMemo(() => {
        if (!categories || categories.length === 0) return [];
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [categories, currentPage]);

    // ==========================================
    // [CHANGE] useEffect - Smooth Scroll
    // Thay thế setTimeout bằng useEffect cho scroll mượt mà hơn
    // ==========================================

    useEffect(() => {
        // Scroll đến books section khi có category được chọn và có sách
        if (selectedCategoryId && categoryBooks.length > 0 && booksRef.current) {
            // Đợi 1 frame để DOM update xong
            requestAnimationFrame(() => {
                booksRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        }
    }, [selectedCategoryId, categoryBooks.length]);

    // ==========================================
    // [CHANGE] Handlers - Memoized với useCallback
    // ==========================================

    /**
     * Xử lý khi click vào category card
     * - Tìm category object để hiển thị tên
     * - Gọi hook để fetch sách (với caching + race condition handling)
     */
    const handleCategoryClick = useCallback((categoryId) => {
        // DEBUG: Log category click
        console.log('[CategoriesPage] 🖱️ Category clicked - ID:', categoryId);

        // Tìm category trong danh sách
        // API có thể trả về: id, _id, hoặc category_id
        const category = categories?.find(
            cat => cat.id === categoryId || cat._id === categoryId || cat.category_id === categoryId
        );

        // DEBUG: Log found category
        console.log('[CategoriesPage] 📌 Found category:', category);

        if (category) {
            // Update selected category cho UI
            setSelectedCategory(category);

            // DEBUG: Log the ID being sent to fetchBooks
            // API có thể trả về: id, _id, hoặc category_id
            const catId = category.id || category._id || category.category_id;
            console.log('[CategoriesPage] 🚀 Calling fetchBooks with ID:', catId);

            // [CHANGE] Gọi hook để fetch sách
            // Hook sẽ tự động check cache và handle race condition
            fetchBooks(catId);
        }
    }, [categories, fetchBooks]);

    /**
     * Chuyển đến trang category cụ thể
     */
    const goToPage = useCallback((pageIndex) => {
        setCurrentPage(pageIndex);
    }, []);

    // ==========================================
    // Render: Loading State
    // ==========================================
    if (categoriesLoading) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-bg-section rounded-2xl p-6 sm:p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-border rounded w-1/3 mb-8" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid-rows-2 gap-4 sm:gap-6">
                                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                    <div key={i} className="aspect-[3/2] bg-border rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ==========================================
    // Render: Error State
    // ==========================================
    if (categoriesError) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-bg-section rounded-2xl p-6 sm:p-8 text-center">
                        <p className="text-red-500">Lỗi: {categoriesError}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ==========================================
    // Render: Main Content
    // ==========================================
    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ========================================== */}
                {/* Categories Section - Fixed height layout */}
                {/* ========================================== */}
                <section className="bg-bg-section rounded-2xl p-6 sm:p-8">
                    {/* Section Title */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-8">
                        Khám phá theo thể loại
                    </h2>

                    {/* [CHANGE] Categories Grid - Fixed 2 rows với placeholder */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid-rows-2 gap-4 sm:gap-6 mb-8">
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => {
                            const category = currentPageCategories[index];

                            if (category) {
                                // API có thể trả về: id, _id, hoặc category_id
                                const categoryId = category.id || category._id || category.category_id;
                                return (
                                    <CategoryCard
                                        key={categoryId}
                                        id={categoryId}
                                        name={category.name}
                                        bookCount={category.bookCount || category.booksCount || 0}
                                        image={category.image || category.cover_url || category.coverImage}
                                        onClick={handleCategoryClick}
                                        selected={selectedCategoryId === categoryId}
                                    />
                                );
                            }

                            // Empty placeholder để giữ grid layout ổn định
                            return (
                                <div
                                    key={`empty-${index}`}
                                    className="aspect-3/2"
                                    aria-hidden="true"
                                />
                            );
                        })}
                    </div>

                    {/* Pagination Dots */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index)}
                                    className={`
                                        w-2.5 h-2.5 rounded-full transition-all duration-300
                                        ${currentPage === index
                                            ? 'bg-text-primary w-6'
                                            : 'bg-border hover:bg-text-sub'
                                        }
                                    `}
                                    aria-label={`Trang ${index + 1}`}
                                    aria-current={currentPage === index ? 'page' : undefined}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* ========================================== */}
                {/* Quick View Books Section */}
                {/* [CHANGE] Sử dụng data từ useBooksByCategory hook */}
                {/* ========================================== */}
                {/* ========================================== */}
                {/* Quick View Books Section */}
                {/* [CHANGE] Sử dụng data từ useBooksByCategory hook */}
                {/* ========================================== */}
                {selectedCategory && (
                    <section ref={booksRef} className="mt-8">
                        {booksError ? (
                            // Error State
                            <div className="bg-bg-section rounded-2xl p-6 text-center">
                                <p className="text-red-500">{booksError}</p>
                            </div>
                        ) : (
                            // [CHANGE] BookSection với data đã được normalize từ hook
                            // Không truyền onBookClick để sử dụng mặc định navigate của BookCard
                            <BookSection
                                key={selectedCategoryId}
                                title={`Sách ${selectedCategory.name}`}
                                books={categoryBooks}
                                viewAllLink={`/search?category=${selectedCategoryId}`}
                                isLoading={booksLoading}
                            />
                        )}
                    </section>
                )}
            </main>

            {/* Chat Button Component */}
            <FloatingChatButton />

            {/* Chat Button Component */}
            <FloatingChatButton />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CategoriesPage;
