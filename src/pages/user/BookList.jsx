// ==========================================
// Page: BookList
// Mô tả: Trang danh sách sách với phân trang và scroll-to-top
// Vị trí: src/pages/user/BookList.jsx
// ==========================================

import { useState, useRef } from 'react';
import Header from '../../componants/layouts/Header';
import BookCard from '../../componants/ui/BookCard';
import Pagination from '../../componants/ui/Pagination';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// ==========================================
// Mock Data - Dữ liệu mẫu (sẽ thay bằng API sau)
// ==========================================
const SAMPLE_COVER = 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Sách';

const generateBooks = (count) =>
    Array.from({ length: count }, (_, i) => ({
        id: `book-${i + 1}`,
        title: `Lịch sử Việt Nam - Tập ${i + 1}`,
        author: 'Đào Duy Anh',
        coverImage: SAMPLE_COVER,
    }));

// Tạo 60 sách mẫu
const allBooks = generateBooks(60);

// ==========================================
// BookList Component
// ==========================================
const BookList = () => {
    // State quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // Số sách mỗi trang
    const booksPerPage = 12;

    // Ref để scroll đến đầu danh sách
    const bookListRef = useRef(null);

    // ==========================================
    // Tính toán phân trang
    // ==========================================
    const totalPages = Math.ceil(allBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = allBooks.slice(startIndex, startIndex + booksPerPage);

    // ==========================================
    // Handler phân trang với Scroll-to-top
    // ==========================================
    const handlePageChange = (page) => {
        // 1. Cập nhật state trang hiện tại
        setCurrentPage(page);

        // 2. Scroll đến đầu danh sách sách (smooth animation)
        // Có offset 100px để tránh bị che bởi header
        const headerOffset = 100;
        const elementPosition = bookListRef.current?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/"
                        className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            Tất cả sách
                        </h1>
                        <p className="text-sm text-text-sub">
                            {allBooks.length} cuốn sách • Trang {currentPage}/{totalPages}
                        </p>
                    </div>
                </div>

                {/* Book Grid - Ref để scroll đến đây */}
                <div
                    ref={bookListRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6"
                >
                    {currentBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            coverImage={book.coverImage}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-10">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </main>
        </div>
    );
};

export default BookList;
