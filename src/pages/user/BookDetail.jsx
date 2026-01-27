// ==========================================
// Page: BookDetail
// Mô tả: Trang chi tiết sách với dữ liệu từ API
// Vị trí: src/pages/user/BookDetail.jsx
// ==========================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import Button from '../../components/ui/Button';
import BorrowConfirmationModal from '../../components/ui/BorrowConfirmationModal';
import Toast from '../../components/ui/Toast';
import useBookHold from '../../hooks/useBookHold';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/book.service';
import { FALLBACK_IMAGES, getBookCoverUrl } from '../../utils/imageUrl';
import ExpandableText from '../../components/ui/ExpandableText';

// ==========================================
// Loading Skeleton
// ==========================================
const BookDetailSkeleton = () => (
    <div className="bg-bg-section rounded-2xl p-6 sm:p-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cover skeleton */}
            <div className="md:col-span-1">
                <div className="aspect-ratio: 3/4 bg-border rounded-lg"></div>
            </div>
            {/* Info skeleton */}
            <div className="md:col-span-2 space-y-6">
                <div className="h-6 bg-border rounded w-24"></div>
                <div className="h-10 bg-border rounded w-3/4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-border rounded w-1/2"></div>
                    <div className="h-4 bg-border rounded w-1/3"></div>
                    <div className="h-4 bg-border rounded w-1/4"></div>
                </div>
                <div className="h-24 bg-border rounded"></div>
                <div className="flex gap-4">
                    <div className="h-12 bg-border rounded flex-1"></div>
                    <div className="h-12 bg-border rounded flex-1"></div>
                </div>
            </div>
        </div>
    </div>
);

// ==========================================
// BookDetail Component
// ==========================================
const BookDetail = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();

    // Book data state
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State quản lý mở rộng/thu gọn mô tả
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // State quản lý modal xác nhận mượn sách
    const [isBorrowConfirmOpen, setIsBorrowConfirmOpen] = useState(false);

    // State quản lý toast notification
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // Hook quản lý book holds
    const { createHold, isBookOnHold, borrowDirectly, actionLoading } = useBookHold();

    // Hook kiểm tra trạng thái đăng nhập
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    // ==========================================
    // Fetch Book Data from API
    // ==========================================
    const fetchBook = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await bookService.getById(bookId);

            // Handle different API response formats
            const bookData = response.data || response;

            // Transform data to match API response format
            setBook({
                id: bookData.book_id || bookData.id || bookData._id,
                title: bookData.title || 'Không rõ',
                author: bookData.authors?.[0]?.name || bookData.author?.name || bookData.authorName || 'Không rõ',
                coverImage: getBookCoverUrl(
                    bookData.cover_url || bookData.coverImage || bookData.image || bookData.thumbnail
                ),
                publishYear: bookData.publish_year || bookData.publishYear || bookData.year || 'N/A',
                categoryId: bookData.categories?.[0]?.category_id || bookData.category?.id || bookData.categoryId,
                categoryName: bookData.categories?.[0]?.name || bookData.category?.name || bookData.categoryName || 'Không phân loại',
                availableCopies: bookData.available_copies || bookData.availableCopies || bookData.available || 0,
                totalCopies: bookData.total_copies || bookData.totalCopies || bookData.total || 0,
                description: bookData.description || 'Không có mô tả',
                versions: bookData.versions || [
                    { id: 'default', year: bookData.publish_year || bookData.publishYear || new Date().getFullYear(), available: true }
                ],
                publisher: bookData.publisher?.name || bookData.publisherName,
                isbn: bookData.isbn,
            });
        } catch (err) {
            console.error('Error fetching book:', err);
            setError(err.message || 'Không thể tải thông tin sách');
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        if (bookId) {
            fetchBook();
        }
    }, [bookId]);

    // ==========================================
    // Handlers
    // ==========================================

    const handleBorrowBook = () => {
        // Auth guard: Redirect nếu chưa đăng nhập
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsBorrowConfirmOpen(true);
    };

    /**
     * Xác nhận mượn sách trực tiếp
     */
    const handleConfirmBorrow = async () => {
        try {
            await borrowDirectly(book.id);

            setIsBorrowConfirmOpen(false);
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Yêu cầu mượn sách đã được gửi thành công!'
            });

        } catch (err) {
            setIsBorrowConfirmOpen(false);

            // Xử lý lỗi giới hạn mượn sách
            const status = err.response?.status;
            const apiMessage = err.response?.data?.message || err.message || '';

            const isLimitError =
                (status === 400 || status === 403 || status === 409 || status === 404) &&
                (apiMessage.includes('limit') || apiMessage.includes('3 phiếu') || apiMessage.includes('trả sách'));

            if (isLimitError) {
                setToast({
                    isOpen: true,
                    type: 'warning',
                    message: 'Bạn đã mượn tối đa 3 phiếu. Vui lòng trả sách để có thể mượn thêm!'
                });
            } else {
                setToast({
                    isOpen: true,
                    type: 'error',
                    message: apiMessage || 'Mượn sách thất bại. Vui lòng thử lại'
                });
            }
        }
    };

    const handleAddToBookshelf = async () => {
        // Auth guard: Redirect nếu chưa đăng nhập
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await createHold({ bookId: book.id });
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Đã thêm sách vào kệ sách!'
            });
        } catch (err) {
            setToast({
                isOpen: true,
                type: 'error',
                message: err.message || 'Không thể thêm vào kệ sách'
            });
        }
    };

    // ==========================================
    // Helper Functions
    // ==========================================
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // ==========================================
    // Render States
    // ==========================================

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-bg-app flex flex-col">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Quay lại</span>
                    </button>
                    <BookDetailSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    // Error State
    if (error || !book) {
        return (
            <div className="min-h-screen bg-bg-app flex flex-col">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-bg-section rounded-2xl p-8 text-center">
                        <h1 className="text-2xl font-bold text-text-primary mb-4">
                            {error || 'Không tìm thấy sách'}
                        </h1>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => navigate(-1)}>
                                Quay lại
                            </Button>
                            <Button variant="outline" onClick={fetchBook}>
                                <RefreshCw size={18} className="mr-2" />
                                Thử lại
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ==========================================
    // Prepare Data for Modals
    // ==========================================
    const borrowDate = new Date();
    const loanPeriod = 10;
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + loanPeriod);

    const borrowInfo = {
        id: book.id,
        availableCopies: book.availableCopies,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        borrowDate: formatDate(borrowDate),
        loanPeriod: loanPeriod,
        dueDate: formatDate(dueDate),
    };

    const isAlreadyOnHold = isBookOnHold(book.id);

    // ==========================================
    // Main Render
    // ==========================================
    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Quay lại</span>
                </button>

                {/* Book Detail Content */}
                <div className="bg-bg-section rounded-2xl p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Book Cover - Left Side */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24">
                                <div className="aspect-3/4 overflow-hidden rounded-lg shadow-lg bg-gray-100">
                                    <img
                                        src={book.coverImage || FALLBACK_IMAGES.bookPlaceholder}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = FALLBACK_IMAGES.bookPlaceholder;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Book Info - Right Side */}
                        <div className="md:col-span-2 flex flex-col h-full">
                            {/* Category Badge */}
                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    {book.categoryName}
                                </span>
                            </div>

                            {/* Title - Full display */}
                            <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-text-primary mb-2 leading-tight">
                                {book.title}
                            </h1>

                            {/* Author & Year - Compact row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-sub mb-6">
                                <span className="font-medium text-text-primary">{book.author}</span>
                                <span className="w-1 h-1 rounded-full bg-text-sub/50"></span>
                                <span>{book.publishYear}</span>
                                <span className="w-1 h-1 rounded-full bg-text-sub/50"></span>
                                <span className={`${book.availableCopies > 0 ? 'text-success' : 'text-error'} font-medium`}>
                                    {book.availableCopies > 0 ? `Còn ${book.availableCopies} cuốn` : 'Hết sách'}
                                </span>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 min-h-0 space-y-6">
                                {/* Description using ExpandableText */}
                                <div>
                                    <h2 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide opacity-80">
                                        Giới thiệu nội dung
                                    </h2>
                                    <ExpandableText content={book.description} maxLength={420} />
                                </div>

                                {/* Meta Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {/* Publisher info */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-sub mb-0.5">Nhà xuất bản</p>
                                            <p className="font-medium text-text-primary truncate" title={book.publisher}>
                                                {book.publisher || 'Đang cập nhật'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Availability Status */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-sub mb-0.5">Tình trạng</p>
                                            <p className="font-medium text-text-primary">
                                                <span className={`${book.availableCopies > 0 ? 'text-success' : 'text-error'} font-semibold`}>
                                                    {book.availableCopies > 0 ? 'Còn sách' : 'Hết sách'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleBorrowBook}
                                    disabled={actionLoading || isAlreadyOnHold}
                                    className="flex-1 shadow-lg shadow-primary/20 py-3 text-base"
                                >
                                    {isAlreadyOnHold ? 'ĐÃ GIỮ CHỖ' : 'MƯỢN SÁCH NGAY'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleAddToBookshelf}
                                    disabled={actionLoading || isAlreadyOnHold}
                                    className="flex-1 py-3 text-base"
                                >
                                    {isAlreadyOnHold ? 'ĐÃ CÓ TRONG KỆ' : 'THÊM VÀO KỆ'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Borrow Confirmation Modal */}
            <BorrowConfirmationModal
                isOpen={isBorrowConfirmOpen}
                onClose={() => setIsBorrowConfirmOpen(false)}
                bookInfo={borrowInfo}
                onConfirm={handleConfirmBorrow}
            />

            {/* Toast Notification */}
            <Toast
                isOpen={toast.isOpen}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, isOpen: false })}
                duration={3000}
            />

            <Footer />
        </div>
    );
};

export default BookDetail;
