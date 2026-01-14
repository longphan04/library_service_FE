// ==========================================
// Page: BookSearch
// Mô tả: Trang tìm kiếm sách với mock API
// Vị trí: src/pages/user/BookSearch.jsx
// ==========================================

import { useState, useEffect } from 'react';
import Header from '../../componants/layouts/Header';
import SearchBar from '../../componants/ui/SearchBar';
import BookCard from '../../componants/ui/BookCard';
import Spinner from '../../componants/ui/Spinner';
import EmptyState from '../../componants/ui/EmptyState';
import { BookX, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

// ==========================================
// Mock Data - Dữ liệu mẫu sách
// ==========================================
const MOCK_BOOKS = [
    {
        id: 'book-1',
        title: 'Lịch sử Việt Nam - Tập 1',
        author: 'Đào Duy Anh',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Lịch+sử+VN',
    },
    {
        id: 'book-2',
        title: 'Truyện Kiều',
        author: 'Nguyễn Du',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Truyện+Kiều',
    },
    {
        id: 'book-3',
        title: 'Số đỏ',
        author: 'Vũ Trọng Phụng',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Số+đỏ',
    },
    {
        id: 'book-4',
        title: 'Chí Phèo',
        author: 'Nam Cao',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Chí+Phèo',
    },
    {
        id: 'book-5',
        title: 'Lão Hạc',
        author: 'Nam Cao',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Lão+Hạc',
    },
    {
        id: 'book-6',
        title: 'Tắt đèn',
        author: 'Ngô Tất Tố',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Tắt+đèn',
    },
    {
        id: 'book-7',
        title: 'Vợ nhặt',
        author: 'Kim Lân',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Vợ+nhặt',
    },
    {
        id: 'book-8',
        title: 'Tôi thấy hoa vàng trên cỏ xanh',
        author: 'Nguyễn Nhật Ánh',
        coverImage: 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Hoa+vàng',
    },
];

// ==========================================
// BookSearch Component
// ==========================================
const BookSearch = () => {
    // Get query from URL params
    const [searchParams] = useSearchParams();
    const queryFromUrl = searchParams.get('q') || '';

    // State Management
    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ==========================================
    // Mock API call - Simulate fetching books
    // ==========================================
    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call với setTimeout
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate random error (10% chance)
            if (Math.random() < 0.1) {
                throw new Error('Không thể tải dữ liệu sách. Vui lòng thử lại.');
            }

            setBooks(MOCK_BOOKS);
            setFilteredBooks(MOCK_BOOKS);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // useEffect: Fetch books on component mount
    // ==========================================
    useEffect(() => {
        fetchBooks();
    }, []);

    // ==========================================
    // useEffect: Filter books based on search query
    // ==========================================
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredBooks(books);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = books.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
            );
            setFilteredBooks(filtered);
        }
    }, [searchQuery, books]);

    // ==========================================
    // Handlers
    // ==========================================
    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleSearchClose = () => {
        setSearchQuery('');
    };

    const handleRetry = () => {
        fetchBooks();
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
                            Tìm Kiếm Sách
                        </h1>
                        <p className="text-sm text-text-sub">
                            Khám phá cuốn sách yêu thích của bạn từ bộ sưu tập của chúng tôi
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <SearchBar
                        placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClose={handleSearchClose}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-800 mb-1">
                                Lỗi
                            </h3>
                            <p className="text-sm text-red-700">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <Spinner size="xl" className="mx-auto mb-4" />
                            <p className="text-text-sub">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                {!isLoading && !error && (
                    <div className="mb-4 text-text-sub">
                        {searchQuery ? (
                            <p>
                                Tìm thấy{' '}
                                <span className="font-semibold text-text-primary">
                                    {filteredBooks.length}
                                </span>{' '}
                                kết quả cho "{searchQuery}"
                            </p>
                        ) : (
                            <p>
                                Hiển thị{' '}
                                <span className="font-semibold text-text-primary">
                                    {filteredBooks.length}
                                </span>{' '}
                                cuốn sách
                            </p>
                        )}
                    </div>
                )}

                {/* Books Grid */}
                {!isLoading && !error && (
                    <>
                        {filteredBooks.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                                {filteredBooks.map((book) => (
                                    <BookCard
                                        key={book.id}
                                        id={book.id}
                                        title={book.title}
                                        author={book.author}
                                        coverImage={book.coverImage}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<BookX size={64} />}
                                title="Không tìm thấy sách"
                                description="Thử điều chỉnh từ khóa tìm kiếm của bạn"
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default BookSearch;
