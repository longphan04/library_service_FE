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
import VersionSelector from '../../components/ui/VersionSelector';
import BorrowConfirmationModal from '../../components/ui/BorrowConfirmationModal';
import Toast from '../../components/ui/Toast';
import useBookHold from '../../hooks/useBookHold';
import bookService from '../../services/book.service';
import { FALLBACK_IMAGES, getBookCoverUrl } from '../../utils/imageUrl';

// ==========================================
// Loading Skeleton
// ==========================================
const BookDetailSkeleton = () => (
    <div className="bg-bg-section rounded-2xl p-6 sm:p-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cover skeleton */}
            <div className="md:col-span-1">
                <div className="aspect-[3/4] bg-border rounded-lg"></div>
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

    // State quản lý modal chọn phiên bản
    const [isVersionSelectorOpen, setIsVersionSelectorOpen] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState(null);

    // State quản lý mở rộng/thu gọn mô tả
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // State quản lý modal xác nhận mượn sách
    const [isBorrowConfirmOpen, setIsBorrowConfirmOpen] = useState(false);

    // State quản lý toast notification
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // Hook quản lý book holds
    const { createHold, isBookOnHold, actionLoading } = useBookHold();

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
    const handleOpenVersionSelector = () => {
        setIsVersionSelectorOpen(true);
    };

    const handleCloseVersionSelector = () => {
        setIsVersionSelectorOpen(false);
    };

    const handleConfirmVersion = (versionId) => {
        setSelectedVersion(versionId);
    };

    const handleBorrowBook = () => {
        if (!selectedVersion && book?.versions?.length > 0) {
            setToast({
                isOpen: true,
                type: 'warning',
                message: 'Vui lòng chọn bản lưu trước khi mượn sách'
            });
            return;
        }
        setIsBorrowConfirmOpen(true);
    };

    const handleConfirmBorrow = async () => {
        try {
            // Call API to create book hold
            await createHold({ bookId: book.id });

            setIsBorrowConfirmOpen(false);
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Yêu cầu mượn sách đã được gửi thành công!'
            });

        } catch (err) {
            setIsBorrowConfirmOpen(false);
            setToast({
                isOpen: true,
                type: 'error',
                message: err.message || 'Mượn sách thất bại. Vui lòng thử lại'
            });
        }
    };

    const handleAddToBookshelf = async () => {
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
                    <BookDetailSkeleton /></main>

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
                    </div></main>

                <Footer />
            </div>
        );
    }

    // ==========================================
    // Prepare Data for Modals
    // ==========================================
    const selectedVersionData = book.versions?.find(v => v.id === selectedVersion);

    const borrowDate = new Date();
    const loanPeriod = 60;
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + loanPeriod);

    const borrowInfo = {
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        borrowDate: formatDate(borrowDate),
        loanPeriod: loanPeriod,
        dueDate: formatDate(dueDate),
        version: selectedVersionData?.year || 'N/A',
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
                        <div className="md:col-span-2 space-y-6">
                            {/* Category Badge */}
                            <div>
                                <span className="inline-block px-3 py-1 bg-primary text-text-on-primary text-xs font-semibold rounded">
                                    {book.categoryName}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
                                {book.title}
                            </h1>

                            {/* Book Meta Info */}
                            <div className="space-y-3">
                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-sub">Tác giả</p>
                                        <p className="text-base font-medium text-text-primary">{book.author}</p>
                                    </div>
                                </div>

                                {/* Publish Year */}
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-sub">Năm xuất bản</p>
                                        <p className="text-base font-medium text-text-primary">{book.publishYear}</p>
                                    </div>
                                </div>

                                {/* Version Selector */}
                                {book.versions && book.versions.length > 0 && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-sm text-text-sub">Bản lưu</p>
                                            <button
                                                onClick={handleOpenVersionSelector}
                                                className="mt-1 px-4 py-1.5 bg-secondary text-text-on-secondary text-sm font-medium rounded hover:bg-secondary-hover transition-colors"
                                            >
                                                {selectedVersionData
                                                    ? `${selectedVersionData.year}`
                                                    : 'Chọn bản'
                                                }
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Availability Status */}
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-text-sub">Tình trạng</p>
                                        <p className="text-base font-medium text-text-primary">
                                            <span className="text-success">{book.availableCopies} có sẵn</span>
                                            {' / '}
                                            <span className="text-text-sub">{book.totalCopies} tổng</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="pt-4 border-t border-border">
                                <h2 className="text-lg font-semibold text-text-primary mb-3">
                                    Mô tả sách
                                </h2>
                                <div className="relative">
                                    <p
                                        className={`text-sm text-text-primary leading-relaxed whitespace-pre-line transition-all duration-300 ${isDescriptionExpanded ? '' : 'line-clamp-4'
                                            }`}
                                    >
                                        {book.description}
                                    </p>

                                    {/* Gradient fade when collapsed */}
                                    {!isDescriptionExpanded && (
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-bg-section to-transparent pointer-events-none" />
                                    )}
                                </div>

                                {/* Read More/Less Button */}
                                <button
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    className="mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                                >
                                    {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleBorrowBook}
                                    disabled={actionLoading || isAlreadyOnHold}
                                    className="flex-1"
                                >
                                    {isAlreadyOnHold ? 'ĐÃ GIỮ SÁCH' : 'MƯỢN SÁCH'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleAddToBookshelf}
                                    disabled={actionLoading || isAlreadyOnHold}
                                    className="flex-1"
                                >
                                    {isAlreadyOnHold ? 'ĐÃ TRONG KỆ' : 'THÊM VÀO KỆ SÁCH'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Version Selector Modal */}
            {book.versions && book.versions.length > 0 && (
                <VersionSelector
                    isOpen={isVersionSelectorOpen}
                    onClose={handleCloseVersionSelector}
                    versions={book.versions}
                    onConfirm={handleConfirmVersion}
                />
            )}

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
        </div>
    );
};

export default BookDetail;
