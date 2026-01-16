// ==========================================
// Page: BookList
// Mô tả: Trang danh sách sách với phân trang và scroll-to-top
// Vị trí: src/pages/user/BookList.jsx
// ==========================================

import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../componants/layouts/Header';
import BookCard from '../../componants/ui/BookCard';
import Pagination from '../../componants/ui/Pagination';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useBooks from '../../hooks/useBooks';

// ==========================================
// BookList Component
// ==========================================
const BookList = () => {
    // Sử dụng hook với URL sync
    const {
        books,
        loading,
        error,
        filters,
        setFilters,
        pagination,
        refetch
    } = useBooks({ limit: 12 });

    // Ref để scroll đến đầu danh sách
    const bookListRef = useRef(null);

    // ==========================================
    // Handler phân trang với Scroll-to-top
    // ==========================================
    const handlePageChange = (page) => {
        // 1. Cập nhật filter (sẽ tự động sync với URL)
        setFilters({ page });

        // 2. Scroll đến đầu danh sách sách (smooth animation)
        const headerOffset = 100;
        const elementPosition = bookListRef.current?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    // ==========================================
    // Loading State
    // ==========================================
    if (loading && books.length === 0) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            <p className="text-sm text-text-sub">Đang tải...</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-3/4 bg-border rounded-lg mb-2"></div>
                                <div className="h-4 bg-border rounded w-3/4 mb-1"></div>
                                <div className="h-3 bg-border rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    // ==========================================
    // Error State
    // ==========================================
    if (error) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">Lỗi: {error}</p>
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Thử lại
                        </button>
                    </div>
                </main>
            </div>
        );
    }

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
                            {pagination.total} cuốn sách • Trang {pagination.page}/{pagination.totalPages || 1}
                        </p>
                    </div>
                </div>

                {/* Book Grid - Ref để scroll đến đây */}
                <div
                    ref={bookListRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6"
                >
                    {books.map((book) => (
                        <BookCard
                            key={book.book_id || book.id || book._id}
                            id={book.book_id || book.id || book._id}
                            title={book.title}
                            author={book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ'}
                            coverImage={book.cover_url || book.coverImage || book.image || book.thumbnail}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {books.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-text-sub">Không tìm thấy sách nào</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookList;
