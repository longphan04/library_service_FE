// ==========================================
// Page: BookSearch
// Mô tả: Trang tìm kiếm sách với filter, sort, và client-side pagination (slide)
// Vị trí: src/pages/user/BookSearch.jsx
// ==========================================

import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import SearchBar from '../../components/ui/SearchBar';
import SortBar from '../../components/ui/SortBar';
import CategoryDropdown from '../../components/ui/CategoryDropdown';
import BookSection from '../../components/ui/BookSection'; // Sử dụng BookSection cho giao diện slider
import { AlertCircle, ArrowLeft } from 'lucide-react';

// Services
import bookService from '../../services/book.service';
import categoryService from '../../services/category.service';
import FloatingChatButton from '../../components/ui/FloatingChatButton';

// ==========================================
// Hằng số (Constants)
// ==========================================
// Lấy số lượng lớn để cho phép phân trang phía client (slide)
const BOOKS_FETCH_LIMIT = 1000;
const ITEMS_PER_SLIDE = 18;

// ==========================================
// Component: BookSearch
// ==========================================
const BookSearch = () => {
    // Quản lý trạng thái URL thông qua SearchParams
    const [searchParams, setSearchParams] = useSearchParams();

    // Lấy các tham số từ URL
    // Ưu tiên: 'keyword' (chuẩn mới) > 'q' (cũ/từ header)
    const rawKeyword = searchParams.get('keyword') || searchParams.get('q');
    const keywordFromUrl = (rawKeyword && rawKeyword !== 'undefined' && rawKeyword !== 'null') ? rawKeyword : '';

    const rawSort = searchParams.get('sort');
    const sortFromUrl = rawSort || 'related';

    // Xử lý trường hợp chuỗi "undefined" trong URL
    const rawCategory = searchParams.get('category');
    const categoryFromUrl = (rawCategory && rawCategory !== 'undefined' && rawCategory !== 'null') ? rawCategory : '';

    // Trạng thái nội bộ (Local State)
    const [inputValue, setInputValue] = useState(keywordFromUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);

    // Trạng thái Danh mục (Categories state)
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Ref để cuộn trang - mặc dù trang không tải lại, nhưng vẫn hữu ích cho lần tải đầu
    const bookListRef = useRef(null);

    // ==========================================
    // Tải danh sách Danh mục khi mount
    // ==========================================
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const response = await categoryService.getAll();
                const data = Array.isArray(response) ? response : response.data || [];

                const transformedCategories = data.map(cat => ({
                    id: String(cat.id || cat._id || cat.category_id),
                    name: cat.name,
                }));

                setCategories(transformedCategories);
            } catch (err) {
                console.error('Lỗi khi tải danh mục:', err);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // ==========================================
    // Hàm hỗ trợ cập nhật tham số URL
    // ==========================================
    const updateSearchParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '' && String(value) !== 'undefined' && String(value) !== 'null') {
                newParams.set(key, String(value));
            } else {
                newParams.delete(key);
            }
        });

        if (updates.keyword !== undefined) {
            newParams.delete('q');
        }

        newParams.delete('page');

        setSearchParams(newParams, { replace: true });
    };

    // ==========================================
    // Tải danh sách sách từ API
    // ==========================================
    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                limit: BOOKS_FETCH_LIMIT,
            };

            // Sử dụng danh mục làm filter cơ bản nếu không có keyword hoặc để thu hẹp tìm kiếm
            if (categoryFromUrl) {
                params.categoryId = categoryFromUrl;
            }

            // Luôn gọi API để lấy dữ liệu mới nhất
            // Chúng ta áp dụng filter so sánh chuỗi chặt chẽ trên kết quả trả về
            // nếu có keyword, nhưng vẫn truyền keyword lên API để tối ưu phía server
            if (keywordFromUrl) {
                params.keyword = keywordFromUrl;
            }

            if (sortFromUrl && sortFromUrl !== 'related') {
                params.sort = sortFromUrl;
            }

            const response = await bookService.getAll(params);

            if (Array.isArray(response)) {
                setBooks(response);
            } else {
                const booksData = response.data || response.books || [];
                setBooks(booksData);
            }
        } catch (err) {
            console.error('Lỗi khi tải sách:', err);
            setError(err.message || 'Không thể tải dữ liệu sách.');
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // Logic Tìm kiếm & Lọc (Sàng lọc phía Client)
    // ==========================================
    // Áp dụng bộ lọc so sánh chuỗi chặt chẽ trên danh sách sách trả về từ API
    // để đảm bảo đáp ứng chính xác yêu cầu "tiêu đề hoặc tác giả chứa keyword".
    const filteredBooks = useMemo(() => {
        if (!keywordFromUrl) return books;

        const term = keywordFromUrl.toLowerCase().trim();
        return books.filter(book => {
            const title = (book.title || '').toLowerCase();
            const author = (
                book.authors?.[0]?.name ||
                book.author?.name ||
                book.authorName ||
                'Không rõ'
            ).toLowerCase();

            return title.includes(term) || author.includes(term);
        });
    }, [books, keywordFromUrl]);

    const totalResults = filteredBooks.length;

    // ==========================================
    // Side Effects
    // ==========================================
    useEffect(() => {
        fetchBooks();
    }, [keywordFromUrl, sortFromUrl, categoryFromUrl]);

    useEffect(() => {
        setInputValue(keywordFromUrl);
    }, [keywordFromUrl]);

    // ==========================================
    // Các hàm xử lý sự kiện (Handlers)
    // ==========================================
    const handleSearchChange = (value) => setInputValue(value);

    const handleSearchSubmit = (value) => {
        const queryToSearch = typeof value === 'string' ? value : inputValue;
        // Khi tìm theo keyword -> Xóa danh mục để đảm bảo độ ưu tiên của tìm kiếm keyword
        updateSearchParams({ keyword: queryToSearch, category: '' });
    };

    const handleSearchClose = () => {
        setInputValue('');
        updateSearchParams({ keyword: '' });
    };

    const handleSortChange = (newSort) => updateSearchParams({ sort: newSort });

    const handleCategoryChange = (newCategory) => {
        setInputValue('');
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

    // ==========================================
    // Render TRANG
    // ==========================================
    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header của trang */}
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

                {/* Thanh điều khiển (Controls) */}
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

                {/* Hiển thị lỗi (Error) */}
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

                {/* Thông tin số lượng kết quả (Results Count) */}
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

                {/* Hiển thị danh sách kết quả sử dụng BookSection (Slider) */}
                {!error && (
                    <div ref={bookListRef}>
                        <BookSection
                            books={filteredBooks.map(book => ({
                                id: book.book_id || book.id || book._id,
                                title: book.title || 'Không rõ',
                                author: book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ',
                                coverImage: book.cover_url || book.coverImage || book.image || book.thumbnail,
                            }))}
                            itemsPerPage={ITEMS_PER_SLIDE}
                            emptyMessage="Không tìm thấy sách nào phù hợp"
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </main>

            <FloatingChatButton />

            <Footer />
        </div>
    );
};

export default BookSearch;
