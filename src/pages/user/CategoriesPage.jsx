// ==========================================
// Page: CategoriesPage
// Mô tả: Trang danh mục sách với dữ liệu từ API
// Vị trí: src/pages/user/CategoriesPage.jsx
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../componants/layouts/Header';
import CategoryCard from '../../componants/ui/CategoryCard';
import BookSection from '../../componants/ui/BookSection';
import useCategories from '../../hooks/useCategories';
import bookService from '../../services/book.service';

// Số lượng category hiển thị mỗi trang (2 hàng x 4 cột)
const ITEMS_PER_PAGE = 8;

// ==========================================
// CategoriesPage Component
// ==========================================
const CategoriesPage = () => {
    // Navigation hook
    const navigate = useNavigate();

    // Fetch categories từ API
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

    // State quản lý trang hiện tại của carousel
    const [currentPage, setCurrentPage] = useState(0);

    // State quản lý category đang chọn để xem quick view
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(false);

    // Ref để scroll đến books section
    const booksRef = useRef(null);

    // Tính tổng số trang
    const totalPages = Math.ceil((categories?.length || 0) / ITEMS_PER_PAGE);

    // Lấy danh sách category cho trang hiện tại
    const getCurrentPageCategories = () => {
        if (!categories || categories.length === 0) return [];
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    // Fetch books khi chọn category
    const fetchCategoryBooks = async (categoryId) => {
        setBooksLoading(true);
        try {
            const response = await bookService.getAll({ category: categoryId, limit: 6 });
            const books = Array.isArray(response) ? response : response.data || [];
            // Transform books để đảm bảo format đúng
            const transformedBooks = books.map(book => ({
                id: book.id || book._id,
                _id: book._id || book.id,
                title: book.title,
                author: book.author?.name || book.authorName || book.author || 'Không rõ',
                coverImage: book.coverImage || book.image || book.thumbnail,
            }));
            setCategoryBooks(transformedBooks);
        } catch (error) {
            console.error('Error fetching category books:', error);
            setCategoryBooks([]);
        } finally {
            setBooksLoading(false);
        }
    };

    // Xử lý khi click vào category - Hiển thị quick view
    const handleCategoryClick = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId || cat._id === categoryId);
        if (category) {
            setSelectedCategory(category);
            fetchCategoryBooks(category.id || category._id);
            // Scroll xuống books section sau khi state update
            setTimeout(() => {
                booksRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 100);
        }
    };

    // Chuyển đến trang cụ thể
    const goToPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    // Loading state
    if (categoriesLoading) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-bg-section rounded-2xl p-6 sm:p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-border rounded w-1/3 mb-8"></div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="h-24 bg-border rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (categoriesError) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-bg-section rounded-2xl p-6 sm:p-8 text-center">
                        <p className="text-red-500">Lỗi: {categoriesError}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                        >
                            Thử lại
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header / Navbar */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Categories Section */}
                <section className="bg-bg-section rounded-2xl p-6 sm:p-8">
                    {/* Section Title */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-8">
                        Khám phá theo thể loại
                    </h2>

                    {/* Categories Grid - 2 rows x 4 columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {getCurrentPageCategories().map((category) => (
                            <CategoryCard
                                key={category.id || category._id}
                                id={category.id || category._id}
                                name={category.name}
                                bookCount={category.bookCount || category.booksCount || 0}
                                onClick={handleCategoryClick}
                            />
                        ))}
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
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Quick View Books Section - Hiển thị khi có category được chọn */}
                {selectedCategory && (
                    <section ref={booksRef} className="mt-8">
                        {booksLoading ? (
                            <div className="bg-bg-section rounded-2xl p-6 animate-pulse">
                                <div className="h-6 bg-border rounded w-1/4 mb-6"></div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="aspect-3/4 bg-border rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <BookSection
                                title={`Sách ${selectedCategory.name}`}
                                books={categoryBooks}
                                viewAllLink={`/search?category=${selectedCategory.id || selectedCategory._id}`}
                            />
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default CategoriesPage;
