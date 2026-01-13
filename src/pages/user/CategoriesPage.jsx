// ==========================================
// Mock Data - Dữ liệu mẫu (sẽ thay bằng API sau)
// ==========================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../componants/layouts/Header';
import CategoryCard from '../../componants/ui/CategoryCard';
import BookSection from '../../componants/ui/BookSection';

const CATEGORIES = [
    { id: 'lich-su', name: 'Lịch Sử', bookCount: 100 },
    { id: 'khoa-hoc', name: 'Khoa Học', bookCount: 85 },
    { id: 'van-hoc', name: 'Văn Học', bookCount: 120 },
    { id: 'trinh-tham', name: 'Trinh Thám', bookCount: 75 },
    { id: 'kinh-te', name: 'Kinh Tế', bookCount: 90 },
    { id: 'tam-ly', name: 'Tâm Lý', bookCount: 65 },
    { id: 'giao-duc', name: 'Giáo Dục', bookCount: 110 },
    { id: 'nghe-thuat', name: 'Nghệ Thuật', bookCount: 55 },
    { id: 'the-thao', name: 'Thể Thao', bookCount: 45 },
    { id: 'am-nhac', name: 'Âm Nhạc', bookCount: 40 },
    { id: 'nau-an', name: 'Nấu Ăn', bookCount: 60 },
    { id: 'du-lich', name: 'Du Lịch', bookCount: 70 },
    { id: 'khoa-hoc-vien-tuong', name: 'Khoa Học Viễn Tưởng', bookCount: 80 },
    { id: 'tieng-anh', name: 'Tiếng Anh', bookCount: 95 },
    { id: 'thieu-nhi', name: 'Thiếu Nhi', bookCount: 130 },
    { id: 'truyen-tranh', name: 'Truyện Tranh', bookCount: 150 },
];

// Mock books data cho mỗi category (6 cuốn mỗi loại)
const SAMPLE_COVER = 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F';

const createSampleBooks = (categoryId, categoryName) => {
    return Array.from({ length: 6 }, (_, i) => ({
        id: `${categoryId}-${i + 1}`,
        title: `${categoryName} ${i + 1}`,
        author: 'Tác giả mẫu',
        coverImage: `${SAMPLE_COVER}?text=${encodeURIComponent(categoryName)}+${i + 1}`,
    }));
};

const SAMPLE_BOOKS = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = createSampleBooks(cat.id, cat.name);
    return acc;
}, {});

// Số lượng category hiển thị mỗi trang (2 hàng x 4 cột)
const ITEMS_PER_PAGE = 8;

// ==========================================
// CategoriesPage Component
// ==========================================
const CategoriesPage = () => {
    // Navigation hook
    const navigate = useNavigate();

    // State quản lý trang hiện tại của carousel
    const [currentPage, setCurrentPage] = useState(0);

    // State quản lý category đang chọn để xem quick view
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Ref để scroll đến books section
    const booksRef = useRef(null);

    // Tính tổng số trang
    const totalPages = Math.ceil(CATEGORIES.length / ITEMS_PER_PAGE);

    // Lấy danh sách category cho trang hiện tại
    const getCurrentPageCategories = () => {
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return CATEGORIES.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    // Xử lý khi click vào category - Hiển thị quick view
    const handleCategoryClick = (categoryId) => {
        const category = CATEGORIES.find(cat => cat.id === categoryId);
        if (category) {
            setSelectedCategory(category);
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
                                key={category.id}
                                id={category.id}
                                name={category.name}
                                bookCount={category.bookCount}
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
                        <BookSection
                            title={`Sách ${selectedCategory.name}`}
                            books={SAMPLE_BOOKS[selectedCategory.id]}
                            viewAllLink={`/categories/${selectedCategory.id}`}
                        />
                    </section>
                )}
            </main>
        </div>
    );
};

export default CategoriesPage;
