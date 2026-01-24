// ==========================================
// Component: BorrowConfirmationModal
// Mô tả: Modal xác nhận mượn sách
// Vị trí: src/components/ui/BorrowConfirmationModal.jsx
// ==========================================

import Modal from './Modal';
import Button from './Button';
import { Calendar, Clock, RotateCcw } from 'lucide-react';

/**
 * BorrowConfirmationModal Component - Popup xác nhận mượn sách
 * @param {boolean} isOpen - Trạng thái mở/đóng modal
 * @param {function} onClose - Handler đóng modal
 * @param {object} bookInfo - Thông tin sách {title, author, coverImage, borrowDate, dueDate, loanPeriod}
 * @param {function} onConfirm - Handler xác nhận mượn sách
 */
const BorrowConfirmationModal = ({
    isOpen = false,
    onClose,
    bookInfo,
    onConfirm,
}) => {
    if (!bookInfo) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

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
                    <img
                        src={bookInfo.coverImage}
                        alt={bookInfo.title}
                        className="w-full rounded-lg shadow-md"
                    />
                </div>

                {/* Book Info - Right Side */}
                <div className="md:col-span-2 space-y-4">
                    {/* Title */}
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-1">
                            {bookInfo.title}
                        </h3>
                        <p className="text-sm text-text-sub">
                            Tác giả: {bookInfo.author}
                        </p>
                    </div>

                    {/* Borrow Info */}
                    <div className="bg-bg-card-hover rounded-lg p-4 space-y-3">
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
                        <p className="text-sm text-text-primary">
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
                    className="flex-1"
                >
                    XÁC NHẬN
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
