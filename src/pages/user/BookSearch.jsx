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

// Services
import bookService from '../../services/book.service';
import categoryService from '../../services/category.service';

// ==========================================
// Constants
// ==========================================
const BOOKS_PER_PAGE = 12;

// ==========================================
// BookSearch Component
// ==========================================
const BookSearch = () => {
    // URL State Management
    const [searchParams, setSearchParams] = useSearchParams();

    // Get params from URL
    const queryFromUrl = searchParams.get('q') || searchParams.get('keyword') || '';
    const sortFromUrl = searchParams.get('sort') || 'related';
    const categoryFromUrl = searchParams.get('category') || '';
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;

    // Local State
    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [viewMode, setViewMode] = useState('grid');

    // Categories state
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Ref for scroll
    const bookListRef = useRef(null);

    // ==========================================
    // Fetch Categories on Mount
    // ==========================================
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const response = await categoryService.getAll();
                const data = Array.isArray(response) ? response : response.data || [];
                // Transform to expected format
                const transformedCategories = data.map(cat => ({
                    id: cat.id || cat._id,
                    name: cat.name,
                }));
                setCategories(transformedCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
        setSearchParams(newParams, { replace: true });
    };

    // ==========================================
    // Fetch Books from API
    // ==========================================
    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Build API params
            const params = {
                page: pageFromUrl,
                limit: BOOKS_PER_PAGE,
            };

            // Add keyword search
            if (queryFromUrl) {
                params.keyword = queryFromUrl;
            }

            // Add category filter
            if (categoryFromUrl) {
                params.category = categoryFromUrl;
            }

            // Add sort (related, newest, popular)
            if (sortFromUrl && sortFromUrl !== 'related') {
                params.sort = sortFromUrl;
            }

            const response = await bookService.getAll(params);

            // Handle different API response formats
            if (Array.isArray(response)) {
                setBooks(response);
                setTotalResults(response.length);
                setTotalPages(1);
            } else {
                const booksData = response.data || response.books || [];
                setBooks(booksData);
                setTotalResults(response.total || booksData.length);
                setTotalPages(response.totalPages || Math.ceil((response.total || booksData.length) / BOOKS_PER_PAGE));
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError(err.message || 'Không thể tải dữ liệu sách. Vui lòng thử lại.');
            setBooks([]);
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
        updateSearchParams({ q: searchQuery, keyword: searchQuery, page: '' });
    };

    const handleSearchClose = () => {
        setSearchQuery('');
        updateSearchParams({ q: '', keyword: '', page: '' });
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

    // Get selected category name for display
    const getSelectedCategoryName = () => {
        const category = categories.find(c => c.id === categoryFromUrl);
        return category?.name || '';
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
                <div className="mb-6">
                    <SearchBar
                        placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClose={handleSearchClose}
                        onKeyDown={handleSearchKeyDown}
                        onSearch={handleSearchSubmit}
                    />
                </div>

                {/* Filter & Sort Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    {/* Category Dropdown */}
                    <CategoryDropdown
                        value={categoryFromUrl}
                        onChange={handleCategoryChange}
                        categories={categories}
                        loading={categoriesLoading}
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
                                {categoryFromUrl && getSelectedCategoryName() && (
                                    <> trong danh mục <span className="font-semibold text-primary">
                                        {getSelectedCategoryName()}
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
                                books={books.map(book => ({
                                    id: book.book_id || book.id || book._id,
                                    title: book.title,
                                    author: book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ',
                                    coverImage: book.cover_url || book.coverImage || book.image || book.thumbnail,
                                }))}
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
