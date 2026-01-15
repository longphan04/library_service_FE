// ==========================================
// Page: BookSearch
// Mô tả: Trang tìm kiếm sách với filter, sort, pagination và URL sync
// Vị trí: src/pages/user/BookSearch.jsx
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../componants/layouts/Header';
import SearchBar from '../../componants/ui/SearchBar';
import SortBar from '../../componants/ui/SortBar';
import CategoryDropdown from '../../componants/ui/CategoryDropdown';
import BookGrid from '../../componants/ui/BookGrid';
import Pagination from '../../componants/ui/Pagination';
import EmptyState from '../../componants/ui/EmptyState';
import Spinner from '../../componants/ui/Spinner';
import { BookX, AlertCircle, ArrowLeft } from 'lucide-react';

// ==========================================
// Mock Data - Dữ liệu mẫu
// ==========================================
const CATEGORIES = [
    { id: 'lich-su', name: 'Lịch Sử' },
    { id: 'khoa-hoc', name: 'Khoa Học' },
    { id: 'van-hoc', name: 'Văn Học' },
    { id: 'trinh-tham', name: 'Trinh Thám' },
    { id: 'kinh-te', name: 'Kinh Tế' },
    { id: 'tam-ly', name: 'Tâm Lý' },
    { id: 'giao-duc', name: 'Giáo Dục' },
    { id: 'nghe-thuat', name: 'Nghệ Thuật' },
    { id: 'the-thao', name: 'Thể Thao' },
    { id: 'am-nhac', name: 'Âm Nhạc' },
    { id: 'nau-an', name: 'Nấu Ăn' },
    { id: 'du-lich', name: 'Du Lịch' },
    { id: 'thieu-nhi', name: 'Thiếu Nhi' },
    { id: 'truyen-tranh', name: 'Truyện Tranh' },
];

const SAMPLE_COVER = 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F';

// Generate mock books với category
const generateMockBooks = () => {
    const books = [];
    CATEGORIES.forEach((cat) => {
        for (let i = 1; i <= 15; i++) {
            books.push({
                id: `${cat.id}-${i}`,
                title: `${cat.name} - Tập ${i}`,
                author: 'Tác giả mẫu',
                coverImage: `${SAMPLE_COVER}?text=${encodeURIComponent(cat.name)}+${i}`,
                category: cat.id,
                categoryName: cat.name,
                createdAt: Date.now() - Math.random() * 10000000000,
                popularity: Math.floor(Math.random() * 1000),
            });
        }
    });
    return books;
};

const ALL_BOOKS = generateMockBooks();
const BOOKS_PER_PAGE = 12;

// ==========================================
// BookSearch Component
// ==========================================
const BookSearch = () => {
    // URL State Management
    const [searchParams, setSearchParams] = useSearchParams();

    // Get params from URL
    const queryFromUrl = searchParams.get('q') || '';
    const sortFromUrl = searchParams.get('sort') || 'newest';
    const categoryFromUrl = searchParams.get('category') || '';
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;

    // Local State
    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState('grid');

    // Ref for scroll
    const bookListRef = useRef(null);

    // ==========================================
    // Update URL params helper
    // ==========================================
    const updateSearchParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, String(value));
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    };

    // ==========================================
    // Fetch/Filter books (Mock API)
    // ==========================================
    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Simulate random error (5% chance)
            if (Math.random() < 0.05) {
                throw new Error('Không thể tải dữ liệu sách. Vui lòng thử lại.');
            }

            // Filter by search query
            let filtered = ALL_BOOKS;
            if (queryFromUrl) {
                const query = queryFromUrl.toLowerCase();
                filtered = filtered.filter(
                    (book) =>
                        book.title.toLowerCase().includes(query) ||
                        book.author.toLowerCase().includes(query)
                );
            }

            // Filter by category
            if (categoryFromUrl) {
                filtered = filtered.filter((book) => book.category === categoryFromUrl);
            }

            // Sort
            if (sortFromUrl === 'newest') {
                filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
            } else if (sortFromUrl === 'popular') {
                filtered = [...filtered].sort((a, b) => b.popularity - a.popularity);
            }

            // Paginate
            const total = Math.ceil(filtered.length / BOOKS_PER_PAGE);
            const startIndex = (pageFromUrl - 1) * BOOKS_PER_PAGE;
            const paginatedBooks = filtered.slice(startIndex, startIndex + BOOKS_PER_PAGE);

            setBooks(paginatedBooks);
            setTotalPages(total || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // Effects
    // ==========================================
    useEffect(() => {
        fetchBooks();
    }, [queryFromUrl, sortFromUrl, categoryFromUrl, pageFromUrl]);

    // Sync local search state with URL
    useEffect(() => {
        setSearchQuery(queryFromUrl);
    }, [queryFromUrl]);

    // ==========================================
    // Handlers
    // ==========================================
    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleSearchSubmit = () => {
        updateSearchParams({ q: searchQuery, page: '' });
    };

    const handleSearchClose = () => {
        setSearchQuery('');
        updateSearchParams({ q: '', page: '' });
    };

    const handleSortChange = (newSort) => {
        updateSearchParams({ sort: newSort, page: '' });
    };

    const handleCategoryChange = (newCategory) => {
        updateSearchParams({ category: newCategory, page: '' });
    };

    const handlePageChange = (newPage) => {
        updateSearchParams({ page: newPage === 1 ? '' : newPage });

        // Scroll to top of book list
        const headerOffset = 100;
        const elementPosition = bookListRef.current?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleRetry = () => {
        fetchBooks();
    };

    // Handle Enter key in search
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // ==========================================
    // Compute total results
    // ==========================================
    const getTotalResults = () => {
        let filtered = ALL_BOOKS;
        if (queryFromUrl) {
            const query = queryFromUrl.toLowerCase();
            filtered = filtered.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
            );
        }
        if (categoryFromUrl) {
            filtered = filtered.filter((book) => book.category === categoryFromUrl);
        }
        return filtered.length;
    };

    const totalResults = getTotalResults();

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
                <div className="mb-6">
                    <SearchBar
                        placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClose={handleSearchClose}
                        onKeyDown={handleSearchKeyDown}
                    />
                </div>

                {/* Filter & Sort Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    {/* Category Dropdown */}
                    <CategoryDropdown
                        value={categoryFromUrl}
                        onChange={handleCategoryChange}
                        categories={CATEGORIES}
                    />

                    {/* Sort Bar */}
                    <SortBar
                        sortBy={sortFromUrl}
                        onSortChange={handleSortChange}
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeChange}
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

                {/* Results Count */}
                {!isLoading && !error && (
                    <div className="mb-4 text-text-sub">
                        {queryFromUrl || categoryFromUrl ? (
                            <p>
                                Tìm thấy{' '}
                                <span className="font-semibold text-text-primary">
                                    {totalResults}
                                </span>{' '}
                                kết quả
                                {queryFromUrl && ` cho "${queryFromUrl}"`}
                                {categoryFromUrl && (
                                    <> trong danh mục <span className="font-semibold text-primary">
                                        {CATEGORIES.find(c => c.id === categoryFromUrl)?.name}
                                    </span></>
                                )}
                            </p>
                        ) : (
                            <p>
                                Hiển thị{' '}
                                <span className="font-semibold text-text-primary">
                                    {totalResults}
                                </span>{' '}
                                cuốn sách
                            </p>
                        )}
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

                {/* Books Grid/List */}
                {!isLoading && !error && (
                    <div ref={bookListRef}>
                        {books.length > 0 ? (
                            <BookGrid
                                books={books}
                                viewMode={viewMode}
                                isLoading={isLoading}
                            />
                        ) : (
                            <EmptyState
                                icon={<BookX size={64} />}
                                title="Không tìm thấy sách"
                                description="Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn"
                            />
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !error && totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination
                            currentPage={pageFromUrl}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookSearch;
