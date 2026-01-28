// ==========================================
// Page: CategoryBookList
// Mô tả: Trang hiển thị danh sách sách theo danh mục
// Chức năng:
//   - Hiển thị thông tin danh mục (tên, số lượng sách)
//   - Hiển thị danh sách sách thuộc danh mục
//   - Hỗ trợ phân trang phía server
//   - Xử lý loading, error, empty states
// API sử dụng:
//   - GET /category/{id} - Lấy thông tin danh mục
//   - GET /book?category={id}&page={}&limit={} - Lấy sách theo danh mục
// Vị trí: src/pages/user/CategoryBookList.jsx
// ==========================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import BookCard from '../../components/ui/BookCardUser';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import { ArrowLeft, RefreshCw } from 'lucide-react';

// Import services để gọi API
import bookService from '../../services/book.service';
import categoryService from '../../services/category.service';

// ==========================================
// Hằng số cấu hình
// ==========================================

/**
 * Số lượng sách hiển thị mỗi trang
 * Tính toán: 4 cột x 3 hàng = 12 sách
 */
const BOOKS_PER_PAGE = 12;

// ==========================================
// Component: CategoryBookListSkeleton
// Mô tả: Hiển thị placeholder khi đang tải dữ liệu
// Sử dụng: Khi loading = true và chưa có dữ liệu
// ==========================================
const CategoryBookListSkeleton = () => (
    <>
        {/* Skeleton cho phần header danh mục */}
        <div className="bg-bg-section rounded-2xl p-6 sm:p-8 mb-8 animate-pulse">
            <div className="flex items-center gap-4">
                {/* Skeleton nút quay lại */}
                <div className="w-10 h-10 bg-border rounded-full"></div>
                {/* Skeleton icon danh mục */}
                <div className="w-16 h-16 bg-border rounded-lg"></div>
                {/* Skeleton thông tin danh mục */}
                <div>
                    <div className="h-8 bg-border rounded w-48 mb-2"></div>
                    <div className="h-4 bg-border rounded w-24"></div>
                </div>
            </div>
        </div>

        {/* Skeleton cho grid sách */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Tạo 8 skeleton cards */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    {/* Skeleton ảnh bìa sách - tỷ lệ 3:4 */}
                    <div className="aspect-[3/4] bg-border rounded-lg mb-2"></div>
                    {/* Skeleton tiêu đề */}
                    <div className="h-4 bg-border rounded w-3/4 mb-1"></div>
                    {/* Skeleton tên tác giả */}
                    <div className="h-3 bg-border rounded w-1/2"></div>
                </div>
            ))}
        </div>
    </>
);

// ==========================================
// Component: EmptyState
// Mô tả: Hiển thị khi danh mục không có sách nào
// Props:
//   - onExplore: Callback khi click nút khám phá danh mục khác
// ==========================================
const EmptyState = ({ onExplore }) => (
    <div className="bg-bg-section rounded-2xl p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
            {/* Icon sách */}
            <div className="inline-flex p-4 bg-primary/10 rounded-full">
                <svg
                    className="w-12 h-12 text-primary"
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
            </div>

            {/* Thông báo trống */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Chưa có sách trong danh mục này
                </h3>
                <p className="text-sm text-text-sub mb-6">
                    Danh mục này hiện chưa có sách nào. Hãy khám phá các danh mục khác!
                </p>
            </div>

            {/* Nút chuyển đến trang danh mục */}
            <button
                onClick={onExplore}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
                KHÁM PHÁ DANH MỤC KHÁC
            </button>
        </div>
    </div>
);

// ==========================================
// Component: CategoryBookList (Main)
// Mô tả: Component chính hiển thị danh sách sách theo danh mục
// Flow:
//   1. Lấy categoryId từ URL params
//   2. Gọi API lấy thông tin danh mục
//   3. Gọi API lấy danh sách sách theo danh mục
//   4. Hiển thị với phân trang
// ==========================================
const CategoryBookList = () => {
    // ==========================================
    // Hooks và Navigation
    // ==========================================

    /**
     * Lấy categoryId từ URL params
     * Ví dụ: /categories/abc123 -> categoryId = "abc123"
     */
    const { categoryId } = useParams();

    /**
     * Hook điều hướng để chuyển trang
     */
    const navigate = useNavigate();

    // ==========================================
    // State Management - Quản lý trạng thái
    // ==========================================

    /**
     * Thông tin danh mục từ API
     * Cấu trúc: { id, name, bookCount }
     */
    const [category, setCategory] = useState(null);

    /**
     * Danh sách sách từ API
     * Mảng các object sách
     */
    const [books, setBooks] = useState([]);

    /**
     * Trạng thái đang tải dữ liệu
     * true: Đang gọi API
     * false: Đã hoàn thành
     */
    const [loading, setLoading] = useState(true);

    /**
     * Thông báo lỗi nếu có
     * null: Không có lỗi
     * string: Nội dung lỗi
     */
    const [error, setError] = useState(null);

    // ==========================================
    // State Phân trang
    // ==========================================

    /**
     * Trang hiện tại (1-indexed)
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * Tổng số sách trong danh mục
     */
    const [totalBooks, setTotalBooks] = useState(0);

    /**
     * Tổng số trang
     */
    const [totalPages, setTotalPages] = useState(1);

    // ==========================================
    // Refs
    // ==========================================

    /**
     * Ref để scroll đến đầu danh sách khi chuyển trang
     */
    const bookListRef = useRef(null);

    // ==========================================
    // API Functions - Các hàm gọi API
    // ==========================================

    /**
     * Lấy thông tin danh mục từ API
     * Endpoint: GET /category/{categoryId}
     * 
     * Xử lý response format khác nhau:
     * - response.data hoặc response trực tiếp
     * - Normalize các field id khác nhau (_id, category_id, id)
     */
    const fetchCategory = useCallback(async () => {
        try {
            // Gọi API lấy thông tin danh mục
            const response = await categoryService.getById(categoryId);

            // Xử lý response - có thể nằm trong .data hoặc trực tiếp
            const categoryData = response.data || response;

            // Chuẩn hóa dữ liệu và lưu vào state
            setCategory({
                id: categoryData.id || categoryData._id || categoryData.category_id,
                name: categoryData.name,
                bookCount: categoryData.bookCount || categoryData.booksCount || 0,
            });
        } catch (err) {
            // Log lỗi nhưng không set error state
            // Vì sẽ hiển thị error từ fetchBooks nếu cả hai fail
            console.error('Lỗi khi tải thông tin danh mục:', err);
        }
    }, [categoryId]);

    /**
     * Lấy danh sách sách theo danh mục từ API
     * Endpoint: GET /book?category={categoryId}&page={page}&limit={limit}
     * 
     * @param {number} page - Số trang cần lấy (mặc định = 1)
     * 
     * Xử lý response format:
     * - Array: Trả về mảng sách trực tiếp
     * - Object: { data/books: [], total, totalPages }
     */
    const fetchBooks = useCallback(async (page = 1) => {
        // Bắt đầu loading
        setLoading(true);
        setError(null);

        try {
            // Gọi API với các params
            const response = await bookService.getAll({
                categoryId: categoryId,  // Backend nhận param "categoryId"
                page: page,              // Trang hiện tại
                limit: BOOKS_PER_PAGE,   // Số sách mỗi trang
            });

            // Xử lý response format khác nhau từ API
            if (Array.isArray(response)) {
                // Trường hợp 1: API trả về mảng trực tiếp
                setBooks(response);
                setTotalBooks(response.length);
                setTotalPages(Math.ceil(response.length / BOOKS_PER_PAGE));
            } else {
                // Trường hợp 2: API trả về object với metadata
                const booksData = response.data || response.books || [];
                setBooks(booksData);
                setTotalBooks(response.total || booksData.length);
                setTotalPages(
                    response.totalPages ||
                    Math.ceil((response.total || booksData.length) / BOOKS_PER_PAGE)
                );
            }
        } catch (err) {
            // Xử lý lỗi
            console.error('Lỗi khi tải danh sách sách:', err);
            setError(err.message || 'Không thể tải danh sách sách');
            setBooks([]);
        } finally {
            // Kết thúc loading
            setLoading(false);
        }
    }, [categoryId]);

    // ==========================================
    // Effects - Các side effects
    // ==========================================

    /**
     * Effect chạy khi component mount hoặc categoryId thay đổi
     * - Gọi API lấy thông tin danh mục
     * - Gọi API lấy danh sách sách trang 1
     * - Reset về trang 1
     */
    useEffect(() => {
        if (categoryId) {
            fetchCategory();      // Lấy thông tin danh mục
            fetchBooks(1);        // Lấy sách trang 1
            setCurrentPage(1);    // Reset về trang 1
        }
    }, [categoryId, fetchCategory, fetchBooks]);

    // ==========================================
    // Event Handlers - Xử lý sự kiện
    // ==========================================

    /**
     * Xử lý khi người dùng chuyển trang
     * @param {number} page - Số trang mới
     * 
     * Flow:
     * 1. Cập nhật state trang hiện tại
     * 2. Gọi API lấy sách trang mới
     * 3. Scroll lên đầu danh sách sách
     */
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchBooks(page);

        // Scroll đến đầu danh sách sách với offset cho header
        const headerOffset = 100;
        const elementPosition = bookListRef.current?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    /**
     * Xử lý khi người dùng click nút "Thử lại"
     * Gọi lại cả hai API: category và books
     */
    const handleRetry = () => {
        fetchCategory();
        fetchBooks(currentPage);
    };

    /**
     * Xử lý khi người dùng click "Khám phá danh mục khác"
     * Chuyển hướng về trang danh mục
     */
    const handleExplore = () => {
        navigate('/categories');
    };

    // ==========================================
    // Helper Functions - Các hàm hỗ trợ
    // ==========================================

    /**
     * Chuyển đổi dữ liệu sách từ API sang format của BookCard
     * Xử lý các field name khác nhau giữa các API
     * 
     * @param {Array} booksData - Mảng sách từ API
     * @returns {Array} - Mảng sách đã chuẩn hóa
     * 
     * Field mapping:
     * - id: book_id | id | _id
     * - author: authors[0].name | author.name | authorName
     * - coverImage: cover_url | coverImage | image | thumbnail
     */
    const transformBooks = (booksData) => {
        return booksData.map(book => ({
            id: book.book_id || book.id || book._id,
            title: book.title,
            author: book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ',
            coverImage: book.cover_url || book.coverImage || book.image || book.thumbnail,
        }));
    };

    /**
     * Icon sách mặc định cho header danh mục
     * Sử dụng SVG inline để tránh phụ thuộc vào icon library
     */
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

    // ==========================================
    // Render: Loading State
    // Hiển thị khi đang tải lần đầu (chưa có category)
    // ==========================================
    if (loading && !category) {
        return (
            <div className="min-h-screen bg-bg-app flex flex-col">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <CategoryBookListSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    // ==========================================
    // Render: Error State
    // Hiển thị khi có lỗi và không có sách
    // ==========================================
    if (error && books.length === 0) {
        return (
            <div className="min-h-screen bg-bg-app flex flex-col">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-bg-section rounded-2xl p-8 text-center">
                        {/* Hiển thị thông báo lỗi */}
                        <h1 className="text-2xl font-bold text-text-primary mb-4">
                            {error}
                        </h1>

                        {/* Các nút hành động */}
                        <div className="flex justify-center gap-4">
                            {/* Nút quay lại danh mục */}
                            <Link
                                to="/categories"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                            >
                                Quay lại danh mục
                            </Link>

                            {/* Nút thử lại */}
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 flex items-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Thử lại
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ==========================================
    // Render: Main Content
    // Hiển thị nội dung chính khi có dữ liệu
    // ==========================================
    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            {/* Header chung của ứng dụng */}
            <Header />

            {/* Nội dung chính */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ========================================== */}
                {/* Phần Header Danh mục */}
                {/* Hiển thị: Nút quay lại, Icon, Tên danh mục, Số sách */}
                {/* ========================================== */}
                <div className="bg-bg-section rounded-2xl p-6 sm:p-8 mb-8">
                    <div className="flex items-center gap-4">
                        {/* Nút quay lại trang danh mục */}
                        <button
                            onClick={() => navigate('/categories')}
                            className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors shrink-0"
                            aria-label="Quay lại"
                        >
                            <ArrowLeft size={24} />
                        </button>

                        {/* Icon đại diện danh mục */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-bg-card-hover text-primary shrink-0">
                            {defaultIcon}
                        </div>

                        {/* Thông tin danh mục */}
                        <div className="flex-1">
                            {/* Tên danh mục */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                {category?.name || 'Đang tải...'}
                            </h1>
                            {/* Số lượng sách */}
                            <p className="text-sm text-text-sub mt-1">
                                {totalBooks > 0 ? `${totalBooks} cuốn sách` : 'Đang tải...'}
                            </p>
                        </div>

                        {/* Nút làm mới dữ liệu */}
                        <button
                            onClick={handleRetry}
                            disabled={loading}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Làm mới"
                        >
                            {/* Icon xoay khi đang loading */}
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* ========================================== */}
                {/* Loading Overlay khi chuyển trang */}
                {/* Hiển thị Spinner khi đang tải nhưng đã có sách trước đó */}
                {/* ========================================== */}
                {loading && books.length > 0 && (
                    <div className="flex justify-center py-8">
                        <Spinner size="lg" />
                    </div>
                )}

                {/* ========================================== */}
                {/* Grid Sách */}
                {/* Layout: 2 cột mobile, 3 cột tablet, 4 cột desktop */}
                {/* ========================================== */}
                {!loading && books.length > 0 && (
                    <div
                        ref={bookListRef}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
                    >
                        {/* Render từng BookCard */}
                        {transformBooks(books).map((book) => (
                            <BookCard
                                key={book.id}
                                id={book.id}
                                title={book.title}
                                author={book.author}
                                coverImage={book.coverImage}
                            />
                        ))}
                    </div>
                )}

                {/* ========================================== */}
                {/* Empty State */}
                {/* Hiển thị khi không có sách và không có lỗi */}
                {/* ========================================== */}
                {!loading && books.length === 0 && !error && (
                    <EmptyState onExplore={handleExplore} />
                )}

                {/* ========================================== */}
                {/* Phân trang */}
                {/* Chỉ hiển thị khi có nhiều hơn 1 trang */}
                {/* ========================================== */}
                {!loading && totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CategoryBookList;
