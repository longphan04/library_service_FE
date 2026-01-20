// ==========================================
// Component: BorrowAllModal
// Mô tả: Modal xác nhận mượn tất cả sách trong kệ
// Features: Portal rendering, useMemo optimization
// Vị trí: src/componants/ui/BorrowAllModal.jsx
// ==========================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from './Button';

// ==========================================
// Constants
// ==========================================

const DEFAULT_LOAN_PERIOD = 60; // days
const FALLBACK_IMAGE = 'https://via.placeholder.com/100x140/FFF8F0/7D5B4F?text=No+Image';

// ==========================================
// Date Formatter (Intl.DateTimeFormat)
// ==========================================

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

const formatDate = (date) => dateFormatter.format(date);

const calculateDueDate = (startDate, days) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
};

// ==========================================
// BookItem Component (Separated)
// ==========================================

const BookItem = ({ book }) => {
    const [imageError, setImageError] = useState(false);

    const coverImage = imageError
        ? FALLBACK_IMAGE
        : (book?.coverImage || book?.cover_url || FALLBACK_IMAGE);

    const title = book?.title || 'Không rõ';
    const author = book?.author || 'Không rõ';
    const availableCopies = book?.availableCopies ?? 0;

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    return (
        <div className="flex gap-3 p-3 bg-white rounded-lg border border-border">
            {/* Cover Image */}
            <img
                src={coverImage}
                alt={title}
                className="w-16 h-24 object-cover rounded-md shrink-0"
                onError={handleImageError}
            />

            {/* Book Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary line-clamp-2 mb-1">
                    {title}
                </h4>
                <p className="text-xs text-text-sub line-clamp-1 mb-2">
                    {author}
                </p>
                <span className={`text-xs font-medium ${availableCopies > 0 ? 'text-success' : 'text-error'}`}>
                    {availableCopies > 0 ? `Còn ${availableCopies} cuốn` : 'Hết sách'}
                </span>
            </div>
        </div>
    );
};

// ==========================================
// BorrowInfo Component
// ==========================================

const BorrowInfo = ({ borrowDate, loanPeriod, dueDate }) => (
    <div className="bg-primary/5 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
            Thông tin mượn
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                    <p className="text-xs text-text-sub">Ngày mượn</p>
                    <p className="text-sm font-medium text-text-primary">
                        {formatDate(borrowDate)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                    <p className="text-xs text-text-sub">Thời hạn</p>
                    <p className="text-sm font-medium text-text-primary">
                        {loanPeriod} ngày
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                    <p className="text-xs text-text-sub">Ngày trả dự kiến</p>
                    <p className="text-sm font-medium text-text-primary">
                        {formatDate(dueDate)}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// ==========================================
// Success State Component
// ==========================================

const SuccessState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="w-16 h-16 text-success mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
            Mượn sách thành công!
        </h3>
        <p className="text-sm text-text-sub">
            Phiếu mượn đã được tạo. Vui lòng đến thư viện để nhận sách.
        </p>
    </div>
);

// ==========================================
// Error Alert Component
// ==========================================

const ErrorAlert = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
        <div>
            <h4 className="text-sm font-semibold text-error mb-1">Lỗi</h4>
            <p className="text-sm text-red-700">{message}</p>
        </div>
    </div>
);

// ==========================================
// BorrowAllModal Component
// ==========================================

const BorrowAllModal = ({
    isOpen,
    onClose,
    books = [],
    onConfirm,
    loading = false,
    loanPeriod = DEFAULT_LOAN_PERIOD,
}) => {
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMessage, setErrorMessage] = useState('');

    // ==========================================
    // Memoized Date Calculations
    // ==========================================

    const { borrowDate, dueDate } = useMemo(() => {
        const borrow = new Date();
        const due = calculateDueDate(borrow, loanPeriod);
        return { borrowDate: borrow, dueDate: due };
    }, [loanPeriod]);

    // Check for unavailable books
    const hasUnavailableBooks = useMemo(() => {
        return books.some((hold) => (hold.book?.availableCopies ?? 0) <= 0);
    }, [books]);

    // ==========================================
    // Effects
    // ==========================================

    // Reset status when modal opens
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    // Escape key to close modal
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape' && status !== 'loading') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, status, onClose]);

    // ==========================================
    // Handlers
    // ==========================================

    const handleConfirm = useCallback(async () => {
        setStatus('loading');
        setErrorMessage('');

        try {
            await onConfirm();
            setStatus('success');

            // Auto close after success
            setTimeout(onClose, 1500);
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message || 'Mượn sách thất bại. Vui lòng thử lại.');
        }
    }, [onConfirm, onClose]);

    const handleBackdropClick = useCallback(() => {
        if (status !== 'loading') {
            onClose();
        }
    }, [status, onClose]);

    // ==========================================
    // Render
    // ==========================================

    // Don't render if not open
    if (!isOpen) return null;

    const isProcessing = status === 'loading';
    const showContent = status !== 'success';
    const showFooter = status !== 'success';

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-4 bg-bg-section rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 id="modal-title" className="text-xl font-bold text-text-primary">
                                Xác nhận mượn sách
                            </h2>
                            <p className="text-sm text-text-sub">
                                {books.length} cuốn sách trong kệ
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Đóng modal"
                    >
                        <X size={20} className="text-text-sub" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {status === 'success' && <SuccessState />}

                    {status === 'error' && <ErrorAlert message={errorMessage} />}

                    {showContent && (
                        <>
                            {/* Borrow Info */}
                            <BorrowInfo
                                borrowDate={borrowDate}
                                loanPeriod={loanPeriod}
                                dueDate={dueDate}
                            />

                            {/* Books Grid */}
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary mb-3">
                                    Danh sách sách ({books.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                    {books.map((hold, index) => (
                                        <BookItem
                                            key={hold.id || hold.holdId || index}
                                            book={hold.book}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Warning for unavailable books */}
                            {hasUnavailableBooks && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-700">
                                        Một số sách hiện không có sẵn. Bạn sẽ được xếp vào danh sách chờ.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {showFooter && (
                    <div className="flex justify-end gap-3 p-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            disabled={isProcessing || books.length === 0}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Xác nhận mượn'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    // Use Portal to render modal at document.body level
    return createPortal(modalContent, document.body);
};

export default BorrowAllModal;
