// ==========================================
// Component: BorrowConfirmationModal
// Mô tả: Modal xác nhận mượn sách - Có check realtime availability
// Vị trí: src/components/ui/BorrowConfirmationModal.jsx
// ==========================================

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Spinner from './Spinner';
import { Calendar, Clock, RotateCcw, AlertTriangle, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import bookService from '@/services/book.service';

/**
 * BorrowConfirmationModal Component - Popup xác nhận mượn sách
 * @param {boolean} isOpen - Trạng thái mở/đóng modal
 * @param {function} onClose - Handler đóng modal
 * @param {object} bookInfo - Thông tin sách {id, title, author, coverImage, borrowDate, dueDate, loanPeriod}
 * @param {function} onConfirm - Handler xác nhận mượn sách
 */
const BorrowConfirmationModal = ({
    isOpen = false,
    onClose,
    bookInfo,
    onConfirm,
}) => {
    // ==========================================
    // State
    // ==========================================
    const [checking, setChecking] = useState(false);
    const [availability, setAvailability] = useState(null); // { status: 'available' | 'out_of_stock' | 'error', copies: 0 }

    // ==========================================
    // Effects
    // ==========================================
    useEffect(() => {
        let isMounted = true;

        const checkAvailability = async () => {
            if (!isOpen || !bookInfo?.id) return;

            setChecking(true);
            setAvailability(null);

            try {
                // Fetch dữ liệu mới nhất từ API
                console.log('[BorrowConfirmation] Checking availability for book:', bookInfo.id);
                const data = await bookService.getById(bookInfo.id);

                // Map fields từ API
                // - available_copies (snake_case) hoặc availableCopies (camelCase)
                // - status (nếu có)
                const bookData = data.data || data; // Handle response wrapper if any
                const availableCopies = bookData.available_copies ?? bookData.availableCopies ?? 0;

                if (isMounted) {
                    setAvailability({
                        status: availableCopies > 0 ? 'available' : 'out_of_stock',
                        copies: availableCopies,
                        total: bookData.total_copies ?? bookData.totalCopies ?? 0
                    });
                }
            } catch (error) {
                console.error('[BorrowConfirmation] Check failed:', error);
                if (isMounted) {
                    setAvailability({ status: 'error', copies: 0 });
                }
            } finally {
                if (isMounted) {
                    setChecking(false);
                }
            }
        };

        if (isOpen) {
            checkAvailability();
        }

        return () => {
            isMounted = false;
        };
    }, [isOpen, bookInfo?.id]);

    // Cleanup state khi đóng modal
    useEffect(() => {
        if (!isOpen) {
            setChecking(false);
            setAvailability(null);
        }
    }, [isOpen]);

    if (!bookInfo) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose(); // Đóng modal ngay sau khi confirm (loading xử lý ở parent)
    };

    // ==========================================
    // Render Helpers
    // ==========================================
    const renderAvailabilityStatus = () => {
        if (checking) {
            return (
                <div className="flex items-center gap-2 text-primary">
                    <Spinner size="sm" />
                    <span className="text-sm font-medium">Đang kiểm tra tình trạng sách...</span>
                </div>
            );
        }

        if (availability?.status === 'available') {
            return (
                <div className="flex items-center gap-2 text-success bg-success/10 px-3 py-2 rounded-lg">
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">
                        Còn sách ({availability.copies} bản khả dụng)
                    </span>
                </div>
            );
        }

        if (availability?.status === 'out_of_stock') {
            return (
                <div className="flex items-center gap-2 text-error bg-error/10 px-3 py-2 rounded-lg">
                    <XCircle size={18} />
                    <span className="text-sm font-medium">
                        Tạm hết sách (Vui lòng chọn Thêm vào kệ để xếp hàng)
                    </span>
                </div>
            );
        }

        if (availability?.status === 'error') {
            return (
                <div className="flex items-center gap-2 text-warning bg-warning/10 px-3 py-2 rounded-lg">
                    <AlertTriangle size={18} />
                    <span className="text-sm font-medium">
                        Không thể kiểm tra tình trạng. Vui lòng thử lại.
                    </span>
                </div>
            );
        }

        return null;
    };

    const isConfirmDisabled = checking || availability?.status === 'out_of_stock' || availability?.status === 'error';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            {/* Title */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-text-primary">
                    Xác nhận mượn sách
                </h2>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Book Cover - Left Side */}
                <div className="md:col-span-1">
                    <div className="aspect-3/4 rounded-lg overflow-hidden shadow-md bg-gray-100">
                        <img
                            src={bookInfo.coverImage}
                            alt={bookInfo.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Book Info - Right Side */}
                <div className="md:col-span-2 space-y-4">
                    {/* Title */}
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-1 line-clamp-2">
                            {bookInfo.title}
                        </h3>
                        <p className="text-sm text-text-sub">
                            Tác giả: {bookInfo.author}
                        </p>
                    </div>

                    {/* Availability Status (Realtime) */}
                    <div>
                        {renderAvailabilityStatus()}
                    </div>

                    {/* Borrow Info */}
                    <div className="bg-bg-card-hover rounded-lg p-4 space-y-3">
                        {/* Available Copies */}
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-text-sub shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-text-sub">Sách có sẵn:</p>
                                <p className={`text-base font-medium ${(availability?.copies ?? bookInfo.availableCopies) > 0 ? 'text-success' : 'text-error'
                                    }`}>
                                    {checking
                                        ? 'Đang kiểm tra...'
                                        : (availability?.copies ?? bookInfo.availableCopies ?? 'Unknown')} bản
                                </p>
                            </div>
                        </div>

                        {/* Borrow Date */}
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-text-sub shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-text-sub">Ngày mượn:</p>
                                <p className="text-base font-medium text-text-primary">
                                    {bookInfo.borrowDate}
                                </p>
                            </div>
                        </div>

                        {/* Loan Period */}
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-text-sub shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-text-sub">Thời hạn:</p>
                                <p className="text-base font-medium text-text-primary">
                                    {bookInfo.loanPeriod} ngày
                                </p>
                            </div>
                        </div>

                        {/* Return Date */}
                        <div className="flex items-center gap-3">
                            <RotateCcw className="w-5 h-5 text-text-sub shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-text-sub">Trả vào:</p>
                                <p className="text-base font-medium text-text-primary">
                                    {bookInfo.dueDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                        <p className="text-sm text-text-primary flex items-start gap-2">
                            <AlertTriangle size={16} className="mt-0.5 text-warning shrink-0" />
                            Vui lòng bảo quản sách cẩn thận và trả đúng hạn
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled}
                    className="flex-1"
                >
                    {checking ? 'ĐANG KIỂM TRA...' : 'XÁC NHẬN MƯỢN'}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={onClose}
                    className="flex-1"
                >
                    HỦY BỎ
                </Button>
            </div>
        </Modal>
    );
};

export default BorrowConfirmationModal;
