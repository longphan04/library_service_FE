// ==========================================
// Component: BookDetailModal
// Mô tả: Modal hiển thị chi tiết sách (thay thế cho trang BookDetail)
// Vị trí: src/components/ui/BookDetailModal.jsx
// ==========================================

import { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import Button from './Button';
import VersionSelector from './VersionSelector';
import BorrowConfirmationModal from './BorrowConfirmationModal';
import Toast from './Toast';
import useBookHold from '../../hooks/useBookHold';
import bookService from '../../services/book.service';
import { FALLBACK_IMAGES } from '../../utils/imageUrl';

// ==========================================
// Loading Skeleton
// ==========================================
const BookDetailSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Cover skeleton */}
            <div className="md:col-span-1">
                <div className="aspect-3/4 bg-border rounded-lg"></div>
            </div>
            {/* Info skeleton */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6">
                <div className="h-6 bg-border rounded w-24"></div>
                <div className="h-8 sm:h-10 bg-border rounded w-3/4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-border rounded w-1/2"></div>
                    <div className="h-4 bg-border rounded w-1/3"></div>
                    <div className="h-4 bg-border rounded w-1/4"></div>
                </div>
                <div className="h-24 bg-border rounded"></div>
                <div className="flex gap-4">
                    <div className="h-10 sm:h-12 bg-border rounded flex-1"></div>
                    <div className="h-10 sm:h-12 bg-border rounded flex-1"></div>
                </div>
            </div>
        </div>
    </div>
);

// ==========================================
// BookDetailModal Component
// ==========================================
const BookDetailModal = ({
    isOpen = false,
    onClose,
    bookId,
}) => {
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
        if (!bookId) return;

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
                coverImage: bookData.cover_url || bookData.coverImage || bookData.image || bookData.thumbnail,
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

    // Fetch on open or bookId change
    useEffect(() => {
        if (isOpen && bookId) {
            fetchBook();
            // Reset states when opening new book
            setSelectedVersion(null);
            setIsDescriptionExpanded(false);
            setError(null);
        }
    }, [isOpen, bookId]);

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

    if (!isOpen) return null;

    // ==========================================
    // Prepare Data for Modals
    // ==========================================
    const selectedVersionData = book?.versions?.find(v => v.id === selectedVersion);

    const borrowDate = new Date();
    const loanPeriod = 60;
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + loanPeriod);

    const borrowInfo = book ? {
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        borrowDate: formatDate(borrowDate),
        loanPeriod: loanPeriod,
        dueDate: formatDate(dueDate),
        version: selectedVersionData?.year || 'N/A',
    } : {};

    const isAlreadyOnHold = book ? isBookOnHold(book.id) : false;

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container - Fixed size, no scroll */}
            <div className="relative w-full max-w-4xl bg-bg-section rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-text-primary shadow-sm hover:shadow transition-all cursor-pointer"
                >
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="p-8 w-full"><BookDetailSkeleton /></div>
                ) : error || !book ? (
                    <div className="text-center py-12 w-full flex flex-col items-center justify-center">
                        <h2 className="text-xl font-bold text-text-primary mb-4">
                            {error || 'Không tìm thấy thông tin sách'}
                        </h2>
                        <Button variant="outline" onClick={fetchBook}>
                            <RefreshCw size={18} className="mr-2" />
                            Thử lại
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* LEFT: Book Cover */}
                        <div className="w-full md:w-2/5 bg-gray-100 flex items-center justify-center p-6 h-full">
                            <div className="relative w-full max-h-full flex justify-center shadow-lg rounded-lg overflow-hidden shrink-0">
                                <img
                                    src={book.coverImage || FALLBACK_IMAGES.bookPlaceholder}
                                    alt={book.title}
                                    className="max-h-[60vh] object-contain md:max-h-full w-auto"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = FALLBACK_IMAGES.bookPlaceholder;
                                    }}
                                />
                            </div>
                        </div>

                        {/* RIGHT: Book Info */}
                        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col h-full overflow-hidden">
                            {/* Header Info */}
                            <div className="shrink-0 space-y-2 mb-4">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    {book.categoryName}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight line-clamp-2" title={book.title}>
                                    {book.title}
                                </h1>
                                <p className="text-lg text-text-sub font-medium truncate">
                                    {book.author}
                                </p>
                            </div>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6 shrink-0 text-sm">
                                <div>
                                    <p className="text-text-sub text-xs">Năm xuất bản</p>
                                    <p className="font-medium">{book.publishYear}</p>
                                </div>
                                <div>
                                    <p className="text-text-sub text-xs">Tình trạng</p>
                                    <p className={`font-medium ${book.availableCopies > 0 ? 'text-success' : 'text-error'}`}>
                                        {book.availableCopies > 0 ? 'Còn sách' : 'Hết sách'}
                                    </p>
                                </div>
                                {book.versions && book.versions.length > 0 && (
                                    <div className="col-span-2 flex items-center gap-2">
                                        <span className="text-text-sub text-xs">Bản lưu:</span>
                                        <button
                                            onClick={handleOpenVersionSelector}
                                            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                                        >
                                            {selectedVersionData ? selectedVersionData.year : 'Chọn phiên bản'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Description - Flexible height with clamp */}
                            <div className="flex-1 min-h-0 relative mb-6">
                                <h3 className="text-sm font-semibold text-text-primary mb-2">Mô tả</h3>
                                <p className="text-sm text-text-sub leading-relaxed line-clamp-6 md:line-clamp-8 text-justify">
                                    {book.description}
                                </p>
                                {book.description && book.description.length > 300 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg-section to-transparent pointer-events-none" />
                                )}
                            </div>

                            {/* Actions - Fixed at bottom */}
                            <div className="shrink-0 flex gap-3 mt-auto">
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={handleBorrowBook}
                                    disabled={actionLoading || isAlreadyOnHold || book.availableCopies === 0}
                                >
                                    {isAlreadyOnHold ? 'Đã giữ' : book.availableCopies === 0 ? 'Hết sách' : 'Mượn ngay'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleAddToBookshelf}
                                    disabled={actionLoading || isAlreadyOnHold}
                                >
                                    Thêm vào kệ
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Version Selector Modal */}
            {book?.versions && book.versions.length > 0 && (
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

export default BookDetailModal;
