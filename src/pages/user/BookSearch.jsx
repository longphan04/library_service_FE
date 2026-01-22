// ==========================================
// Page: BookSearch
// Mô tả: Trang tìm kiếm sách với filter, sort, và client-side pagination (slide)
// Vị trí: src/pages/user/BookSearch.jsx
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import SearchBar from '../../components/ui/SearchBar';
import SortBar from '../../components/ui/SortBar';
import CategoryDropdown from '../../components/ui/CategoryDropdown';
import BookSection from '../../components/ui/BookSection'; // Using BookSection for slider UI
import Spinner from '../../components/ui/Spinner';
import BookDetailModal from '../../components/ui/BookDetailModal';
import { AlertCircle, ArrowLeft } from 'lucide-react';

// Services
import bookService from '../../services/book.service';
import categoryService from '../../services/category.service';

// ==========================================
// Constants
// ==========================================
// Fetch large number to allow client-side pagination (slide)
const BOOKS_FETCH_LIMIT = 1000;
const ITEMS_PER_SLIDE = 18;

// ==========================================
// BookSearch Component
// ==========================================
const BookSearch = () => {
    // URL State Management
    const [searchParams, setSearchParams] = useSearchParams();

    // Get params from URL
    // Priority: 'keyword' (new standard) > 'q' (legacy/header)
    const rawKeyword = searchParams.get('keyword') || searchParams.get('q');
    const keywordFromUrl = (rawKeyword && rawKeyword !== 'undefined' && rawKeyword !== 'null') ? rawKeyword : '';

    const rawSort = searchParams.get('sort');
    const sortFromUrl = rawSort || 'related';

    // Fix: Handle 'undefined' string in URL
    const rawCategory = searchParams.get('category');
    const categoryFromUrl = (rawCategory && rawCategory !== 'undefined' && rawCategory !== 'null') ? rawCategory : '';

    // Local State
    const [inputValue, setInputValue] = useState(keywordFromUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);
    const [totalResults, setTotalResults] = useState(0);

    // Categories state
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // State for Book Detail Modal
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Ref for scroll - though page no longer reloads, useful for initial load
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

                // DEBUG: Log raw category data
                console.log('[BookSearch] Raw categories from API:', data);

                const transformedCategories = data.map(cat => ({
                    // API có thể trả về: id, _id, hoặc category_id
                    id: String(cat.id || cat._id || cat.category_id),
                    name: cat.name,
                }));

                // DEBUG: Log transformed categories
                console.log('[BookSearch] Transformed categories:', transformedCategories);

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
            // Fix: Check for string "undefined" explicitly
            if (value !== null && value !== undefined && value !== '' && String(value) !== 'undefined' && String(value) !== 'null') {
                newParams.set(key, String(value));
            } else {
                newParams.delete(key);
            }
        });

        if (updates.keyword !== undefined) {
            newParams.delete('q');
        }

        // Remove page param if exists from legacy links
        newParams.delete('page');

        setSearchParams(newParams, { replace: true });
    };

    // ==========================================
    // Fetch Books from API
    //Logic: Keyword > Category > All
    // ==========================================
    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                limit: BOOKS_FETCH_LIMIT, // Fetch all for client-side slider
            };

            // EXCLUSIVE LOGIC
            // Only add params if they are valid
            if (keywordFromUrl) {
                // 1. Search by Keyword (Ignore category)
                params.keyword = keywordFromUrl;
            } else if (categoryFromUrl) {
                // 2. Search by Category (Only if no keyword)
                // Backend nhận param "categoryId"
                params.categoryId = categoryFromUrl;
            }
            // 3. Else fetch all (default params)

            // Add sort
            if (sortFromUrl && sortFromUrl !== 'related') {
                params.sort = sortFromUrl;
            }

            const response = await bookService.getAll(params);

            if (Array.isArray(response)) {
                setBooks(response);
                setTotalResults(response.length);
            } else {
                const booksData = response.data || response.books || [];
                setBooks(booksData);
                setTotalResults(response.total || booksData.length);
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError(err.message || 'Không thể tải dữ liệu sách.');
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
    }, [keywordFromUrl, sortFromUrl, categoryFromUrl]);

    useEffect(() => {
        setInputValue(keywordFromUrl);
    }, [keywordFromUrl]);

    // ==========================================
    // Handlers
    // ==========================================
    const handleSearchChange = (value) => setInputValue(value);

    const handleSearchSubmit = (value) => {
        const queryToSearch = typeof value === 'string' ? value : inputValue;
        // Search by keyword -> Clear category to avoid confusion and enforce priority
        updateSearchParams({ keyword: queryToSearch, category: '' });
    };

    const handleSearchClose = () => {
        setInputValue('');
        updateSearchParams({ keyword: '' });
    };

    const handleSortChange = (newSort) => updateSearchParams({ sort: newSort });

    const handleCategoryChange = (newCategory) => {
        // DEBUG: Log category change
        console.log('[BookSearch] handleCategoryChange called with:', newCategory, typeof newCategory);

        // Search by category -> Clear keyword to ensure category is active
        setInputValue(''); // Also clear input visual
        updateSearchParams({ category: newCategory, keyword: '' });
    };

    const handleRetry = () => fetchBooks();

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    const getSelectedCategoryName = () => {
        if (!categoryFromUrl) return '';
        const category = categories.find(c => String(c.id) === String(categoryFromUrl));
        return category?.name || '';
    };

    const handleBookClick = (bookId) => {
        setSelectedBookId(bookId);
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => setIsDetailModalOpen(false);

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            <Header />

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
                            Khám phá cuốn sách yêu thích của bạn
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                        <div className="w-full sm:w-98">
                            <SearchBar
                                placeholder="Tìm theo tên sách hoặc tác giả..."
                                value={inputValue}
                                onChange={handleSearchChange}
                                onClose={handleSearchClose}
                                onKeyDown={handleSearchKeyDown}
                                onSearch={handleSearchSubmit}
                            />
                        </div>

                        <CategoryDropdown
                            value={categoryFromUrl}
                            onChange={handleCategoryChange}
                            categories={categories}
                            loading={categoriesLoading}
                        />
                    </div>

                    <SortBar
                        sortBy={sortFromUrl}
                        onSortChange={handleSortChange}
                        showViewToggle={false}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-800 mb-1">Lỗi</h3>
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
                {isLoading ? (
                    <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-4" />
                ) : !error && (
                    <div className="mb-4 text-text-sub">
                        {keywordFromUrl ? (
                            <p>
                                Tìm thấy <span className="font-semibold text-text-primary">{totalResults}</span> kết quả cho "{keywordFromUrl}"
                            </p>
                        ) : categoryFromUrl ? (
                            <p>
                                Tìm thấy <span className="font-semibold text-text-primary">{totalResults}</span> sách trong danh mục <span className="font-semibold text-primary">{getSelectedCategoryName()}</span>
                            </p>
                        ) : (
                            <p>
                                Hiển thị <span className="font-semibold text-text-primary">{totalResults}</span> cuốn sách
                            </p>
                        )}
                    </div>
                )}

                {/* Results using BookSection for Slider/Points */}
                {!error && (
                    <div ref={bookListRef}>
                        <BookSection
                            books={books.map(book => ({
                                id: book.book_id || book.id || book._id,
                                title: book.title,
                                author: book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ',
                                coverImage: book.cover_url || book.coverImage || book.image || book.thumbnail,
                            }))}
                            itemsPerPage={ITEMS_PER_SLIDE}
                            onBookClick={handleBookClick}
                            emptyMessage="Không tìm thấy sách nào phù hợp"
                            isLoading={isLoading}
                        // No title provided -> Header hidden
                        />
                    </div>
                )}
            </main>

            <BookDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                bookId={selectedBookId}
            />

            <Footer />
        </div>
    );
};

export default BookSearch;
