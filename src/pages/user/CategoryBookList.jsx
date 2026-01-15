// ==========================================
// Page: CategoryBookList
// Mô tả: Trang danh sách sách theo danh mục
// Vị trí: src/pages/user/CategoryBookList.jsx
// ==========================================

import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../componants/layouts/Header';
import BookCard from '../../componants/ui/BookCard';
import Pagination from '../../componants/ui/Pagination';
import { ArrowLeft } from 'lucide-react';

// ==========================================
// Mock Data - Dữ liệu mẫu (sẽ thay bằng API sau)
// ==========================================

// Danh sách danh mục
const CATEGORIES = {
    'lich-su': { name: 'Lịch Sử', bookCount: 100 },
    'khoa-hoc': { name: 'Khoa Học', bookCount: 85 },
    'van-hoc': { name: 'Văn Học', bookCount: 120 },
    'trinh-tham': { name: 'Trinh Thám', bookCount: 75 },
    'kinh-te': { name: 'Kinh Tế', bookCount: 90 },
    'tam-ly': { name: 'Tâm Lý', bookCount: 65 },
    'giao-duc': { name: 'Giáo Dục', bookCount: 110 },
    'nghe-thuat': { name: 'Nghệ Thuật', bookCount: 55 },
    'the-thao': { name: 'Thể Thao', bookCount: 45 },
    'am-nhac': { name: 'Âm Nhạc', bookCount: 40 },
    'nau-an': { name: 'Nấu Ăn', bookCount: 60 },
    'du-lich': { name: 'Du Lịch', bookCount: 70 },
    'khoa-hoc-vien-tuong': { name: 'Khoa Học Viễn Tưởng', bookCount: 80 },
    'tieng-anh': { name: 'Tiếng Anh', bookCount: 95 },
    'thieu-nhi': { name: 'Thiếu Nhi', bookCount: 130 },
    'truyen-tranh': { name: 'Truyện Tranh', bookCount: 150 },
};

// Ảnh bìa sách mẫu
const SAMPLE_COVER = 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Lịch+Sử+Việt+Nam';

// Generate sách theo danh mục
const generateBooksForCategory = (categoryId, count) => {
    const category = CATEGORIES[categoryId];
    return Array.from({ length: count }, (_, i) => ({
        id: `${categoryId}-book-${i + 1}`,
        title: `${category?.name || 'Sách'} - Tập ${i + 1}`,
        author: 'Đào Duy Anh',
        coverImage: SAMPLE_COVER,
        categoryId,
    }));
};

// ==========================================
// CategoryBookList Component
// ==========================================
const CategoryBookList = () => {
    // Lấy categoryId từ URL params
    const { categoryId } = useParams();
    const navigate = useNavigate();

    // State quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // Ref để scroll đến đầu danh sách
    const bookListRef = useRef(null);

    // Lấy thông tin danh mục
    const category = CATEGORIES[categoryId];

    // Nếu không tìm thấy danh mục, hiển thị thông báo
    if (!category) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-text-primary mb-4">
                            Danh mục không tồn tại
                        </h1>
                        <Link to="/categories" className="text-primary hover:underline">
                            Quay lại danh sách danh mục
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // Generate sách cho danh mục này
    const allBooks = generateBooksForCategory(categoryId, category.bookCount);

    // Số sách mỗi trang (4 cột x 3 hàng = 12 sách)
    const booksPerPage = 12;

    // Tính toán phân trang
    const totalPages = Math.ceil(allBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = allBooks.slice(startIndex, startIndex + booksPerPage);

    // Handler phân trang với scroll-to-top
    const handlePageChange = (page) => {
        setCurrentPage(page);

        // Scroll đến đầu danh sách sách
        const headerOffset = 100;
        const elementPosition = bookListRef.current?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    // Handler mượn sách
    const handleBorrowBook = (bookId) => {
        console.log('Mượn sách:', bookId);
        // TODO: Thêm logic mượn sách (API call, modal confirmation, etc.)
    };

    // Icon sách mặc định
    const defaultIcon = (
        <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
        </svg>
    );

    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Header */}
                <div className="bg-bg-section rounded-2xl p-6 sm:p-8 mb-8">
                    <div className="flex items-center gap-4">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/categories')}
                            className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors shrink-0"
                            aria-label="Quay lại"
                        >
                            <ArrowLeft size={24} />
                        </button>

                        {/* Category Icon */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-bg-card-hover text-primary shrink-0">
                            {defaultIcon}
                        </div>

                        {/* Category Info */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                {category.name}
                            </h1>
                            <p className="text-sm text-text-sub mt-1">
                                {category.bookCount} cuốn sách
                            </p>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                <div
                    ref={bookListRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
                >
                    {currentBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            coverImage={book.coverImage}
                            onBorrow={handleBorrowBook}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default CategoryBookList;
