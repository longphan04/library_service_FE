// ==========================================
// Page: BookDetail
// Mô tả: Trang chi tiết sách
// Vị trí: src/pages/user/BookDetail.jsx
// ==========================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../componants/layouts/Header';
import Button from '../../componants/ui/Button';
import VersionSelector from '../../componants/ui/VersionSelector';
import BorrowConfirmationModal from '../../componants/ui/BorrowConfirmationModal';
import Toast from '../../componants/ui/Toast';
import useBorrowedBooks from '../../hooks/useBorrowedBooks';

// ==========================================
// Mock Data - Dữ liệu mẫu (sẽ thay bằng API sau)
// ==========================================

const SAMPLE_COVER = 'https://via.placeholder.com/300x420/FFF8F0/7D5B4F?text=Lịch+Sử+Việt+Nam';

// Mock book data
const MOCK_BOOKS = {
    'lich-su-book-1': {
        id: 'lich-su-book-1',
        title: 'Lịch Sử Việt Nam',
        author: 'Đào Duy Anh',
        coverImage: SAMPLE_COVER,
        publishYear: 2015,
        categoryId: 'lich-su',
        categoryName: 'Lịch Sử',
        availableCopies: 3,
        totalCopies: 123,
        description: `efeyophpkkkreexdgwufjejfhrdloggrynzngoxezsUOTGHMMCFFONZXCVBNMWICVZCWFWPSSPDFGHPHJGDFGP
HGTPPGHGRFDHTRDHTGHTRDTHDFHGTFGHFGHFGFDHGHTDHVTFKURTTRJVRAEETAIFRHFITDTPRRRFGJHIOEGSFADDTRGRRUDTDIJ
GKIJKJGTJHIGESSTGTDHFJRIDFDFBFJFDFISSTDNZSGHDFJKFSJKKNBSSAFFSGHHLJGHHISSFADDTKSGHTHIGFBGTHDSFGD
TPDGFD`,
        versions: [
            { id: 'v1', year: 2025, available: true },
            { id: 'v2', year: 2024, available: true },
            { id: 'v3', year: 2024, available: false },
            { id: 'v4', year: 2024, available: true },
            { id: 'v5', year: 2024, available: true },
            { id: 'v6', year: 2024, available: true },
        ]
    }
};

// ==========================================
// BookDetail Component
// ==========================================
const BookDetail = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();

    // State quản lý modal chọn phiên bản
    const [isVersionSelectorOpen, setIsVersionSelectorOpen] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState(null);

    // State quản lý mở rộng/thu gọn mô tả
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // State quản lý modal xác nhận mượn sách
    const [isBorrowConfirmOpen, setIsBorrowConfirmOpen] = useState(false);

    // State quản lý toast notification
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // Hook quản lý sách đã mượn
    const { addBorrowedBook, isBookBorrowed } = useBorrowedBooks();

    // Lấy thông tin sách từ mock data
    const book = MOCK_BOOKS[bookId];

    // Nếu không tìm thấy sách
    if (!book) {
        return (
            <div className="min-h-screen bg-bg-app">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-text-primary mb-4">
                            Không tìm thấy sách
                        </h1>
                        <Button onClick={() => navigate(-1)}>
                            Quay lại
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    // Handlers
    const handleOpenVersionSelector = () => {
        setIsVersionSelectorOpen(true);
    };

    const handleCloseVersionSelector = () => {
        setIsVersionSelectorOpen(false);
    };

    const handleConfirmVersion = (versionId) => {
        setSelectedVersion(versionId);
        console.log('Selected version:', versionId);
    };

    const handleBorrowBook = () => {
        if (!selectedVersion) {
            alert('Vui lòng chọn bản lưu trước khi mượn sách');
            return;
        }
        // Mở modal xác nhận
        setIsBorrowConfirmOpen(true);
    };

    const handleConfirmBorrow = () => {
        try {
            // Tính toán ngày mượn và ngày trả
            const borrowDate = new Date();
            const loanPeriod = 60;
            const dueDate = new Date(borrowDate);
            dueDate.setDate(dueDate.getDate() + loanPeriod);

            // Format dates
            const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };

            const selectedVersionData = book.versions.find(v => v.id === selectedVersion);

            // Lưu vào localStorage
            addBorrowedBook({
                id: bookId,
                title: book.title,
                author: book.author,
                coverImage: book.coverImage,
                borrowDate: formatDate(borrowDate),
                dueDate: formatDate(dueDate),
                version: selectedVersionData?.year || 'N/A',
            });

            // Đóng modal xác nhận
            setIsBorrowConfirmOpen(false);

            // Hiển thị toast success
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Bạn đã được cho phép mượn sách thành công'
            });

        } catch (error) {
            // Đóng modal xác nhận
            setIsBorrowConfirmOpen(false);

            // Hiển thị toast error
            setToast({
                isOpen: true,
                type: 'error',
                message: error.message || 'Mượn sách thất bại. Vui lòng thử lại'
            });
        }
    };

    const handleAddToBookshelf = () => {
        console.log('Thêm vào kệ sách:', bookId);
        // TODO: Implement add to bookshelf logic
    };

    // Tìm phiên bản được chọn
    const selectedVersionData = book.versions.find(v => v.id === selectedVersion);

    // Tính toán ngày mượn và ngày trả
    const borrowDate = new Date();
    const loanPeriod = 60; // 60 ngày
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + loanPeriod);

    // Format dates
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Thông tin cho modal xác nhận
    const borrowInfo = {
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        borrowDate: formatDate(borrowDate),
        loanPeriod: loanPeriod,
        dueDate: formatDate(dueDate),
        version: selectedVersionData?.year || 'N/A',
    };

    return (
        <div className="min-h-screen bg-bg-app">
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
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full rounded-lg shadow-lg"
                                />
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
                                            <span className="text-text-sub">{book.totalCopies} đã mượn</span>
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
                                    className="flex-1"
                                >
                                    MƯỢN SÁCH
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleAddToBookshelf}
                                    className="flex-1"
                                >
                                    THÊM VÀO KỆ SÁCH
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Version Selector Modal */}
            <VersionSelector
                isOpen={isVersionSelectorOpen}
                onClose={handleCloseVersionSelector}
                versions={book.versions}
                onConfirm={handleConfirmVersion}
            />

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
