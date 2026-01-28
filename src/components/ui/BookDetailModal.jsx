// ==========================================
// Component: BookDetailModal
// Mô tả: Modal hiển thị chi tiết sách (thay thế cho trang BookDetail)
// Vị trí: src/components/ui/BookDetailModal.jsx
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RefreshCw } from 'lucide-react';
import Button from './Button';
import BorrowConfirmationModal from './BorrowConfirmationModal';
import Toast from './Toast';
import useBookHold from '../../hooks/useBookHold';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/book.service';
import { FALLBACK_IMAGES, getBookCoverUrl } from '../../utils/imageUrl';
import ExpandableText from './ExpandableText';

// ==========================================
// Loading Skeleton (Hiệu ứng khi đang tải)
// ==========================================
const BookDetailSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Skeleton ảnh bìa */}
            <div className="md:col-span-1">
                <div className="aspect-3/4 bg-border rounded-lg"></div>
            </div>
            {/* Skeleton thông tin */}
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
// Component chính: BookDetailModal
// ==========================================
const BookDetailModal = ({
    isOpen = false,
    onClose,
    bookId,
}) => {
    // Ref to track current bookId for race condition handling
    const currentBookIdRef = useRef(bookId);

    // Trạng thái dữ liệu sách
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Trạng thái modal xác nhận mượn sách
    const [isBorrowConfirmOpen, setIsBorrowConfirmOpen] = useState(false);

    // Trạng thái thông báo Toast
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // Hook quản lý việc giữ sách (book holds)
    const { createHold, isBookOnHold, borrowDirectly, actionLoading } = useBookHold();

    // Hook kiểm tra trạng thái đăng nhập
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ==========================================
    // FetchBook: Lấy dữ liệu sách từ API
    // ==========================================
    useEffect(() => {
        // Update ref to current bookId
        currentBookIdRef.current = bookId;

        if (!isOpen || !bookId) return;

        // Create AbortController for this fetch
        const abortController = new AbortController();

        const fetchBook = async () => {
            // Reset state for new book
            setBook(null);
            setLoading(true);
            setError(null);

            try {
                const response = await bookService.getById(bookId);

                // Check if this request is still relevant (bookId hasn't changed)
                if (currentBookIdRef.current !== bookId) {
                    console.log('[BookDetailModal] Stale response ignored for bookId:', bookId);
                    return;
                }

                // Xử lý các định dạng phản hồi khác nhau của API
                let bookData = response.data || response;
                if (bookData.book) {
                    bookData = bookData.book;
                } else if (bookData.data) {
                    bookData = bookData.data;
                }

                console.log('[BookDetailModal] Raw API Response:', response);
                console.log('[BookDetailModal] Processed bookData:', bookData);

                // Chuyển đổi dữ liệu để khớp với định dạng hiển thị
                setBook({
                    id: bookData.book_id || bookData.id || bookData._id,
                    title: bookData.title || 'Không rõ',
                    author: bookData.authors?.[0]?.name || bookData.author?.name || bookData.authorName || 'Không rõ',
                    coverImage: getBookCoverUrl(
                        bookData.cover_url || bookData.coverImage || bookData.image || bookData.thumbnail
                    ),
                    publishYear: bookData.publish_year || bookData.publishYear || bookData.year || bookData.publication_year || bookData.publicationYear || 'N/A',
                    categoryId: bookData.categories?.[0]?.category_id || bookData.category?.id || bookData.categoryId,
                    categoryName: bookData.categories?.[0]?.name || bookData.category?.name || bookData.categoryName || 'Không phân loại',
                    availableCopies: bookData.available_copies || bookData.availableCopies || bookData.available || 0,
                    totalCopies: bookData.total_copies || bookData.totalCopies || bookData.total || 0,
                    description: bookData.description || bookData.summary || bookData.desc || 'Không có mô tả',
                    publisher: bookData.publisher?.name || bookData.publisherName || bookData.publisher,
                    isbn: bookData.isbn,
                });
            } catch (err) {
                // Ignore abort errors
                if (err.name === 'AbortError') {
                    console.log('[BookDetailModal] Fetch aborted for bookId:', bookId);
                    return;
                }
                console.error('Lỗi khi tải dữ liệu sách:', err);
                setError(err.message || 'Không thể tải thông tin sách');
            } finally {
                // Only set loading false if this is still the current request
                if (currentBookIdRef.current === bookId) {
                    setLoading(false);
                }
            }
        };

        fetchBook();

        // Cleanup: abort fetch on unmount or bookId/isOpen change
        return () => {
            abortController.abort();
        };
    }, [isOpen, bookId]);

    // ==========================================
    // Các hàm xử lý (Handlers)
    // ==========================================
    const handleBorrowBook = () => {
        // Auth guard: Redirect nếu chưa đăng nhập
        if (!authLoading && !isAuthenticated) {
            onClose(); // Đóng modal trước
            navigate('/login');
            return;
        }
        setIsBorrowConfirmOpen(true);
    };

    /**
     * Xác nhận mượn sách trực tiếp (Không qua kệ sách)
     * Thực hiện quy trình: Tạo Hold -> Tạo Phiếu Mượn
     */
    const handleConfirmBorrow = async () => {
        try {
            // Sử dụng hàm mượn trực tiếp từ hook đã được refactor
            await borrowDirectly(book.id);

            setIsBorrowConfirmOpen(false);
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Yêu cầu mượn sách đã được gửi thành công!'
            });

        } catch (err) {
            setIsBorrowConfirmOpen(false);

            // Xử lý lỗi giới hạn mượn sách (Max 3 phiếu)
            const status = err.response?.status;
            const apiMessage = err.response?.data?.message || err.message || '';

            const isLimitError =
                (status === 400 || status === 403 || status === 409 || status === 404) &&
                (apiMessage.includes('limit') || apiMessage.includes('3 phiếu') || apiMessage.includes('trả sách'));

            if (isLimitError) {
                // Thay vì PopUp, ta sử dụng Toast màu nâu (warning)
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
            onClose(); // Đóng modal trước
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
    // Các hàm tiện ích (Helper Functions)
    // ==========================================
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (!isOpen) return null;

    // ==========================================
    // Chuẩn bị dữ liệu cho các modal khác
    // ==========================================
    const borrowDate = new Date();
    const loanPeriod = 10;
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + loanPeriod);

    const borrowInfo = book ? {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        borrowDate: formatDate(borrowDate),
        loanPeriod: loanPeriod,
        dueDate: formatDate(dueDate),
    } : {};

    const isAlreadyOnHold = book ? isBookOnHold(book.id) : false;

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Lớp nền mờ (Overlay) */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Container của Modal - Kích thước cố định, không cuộn bên ngoài */}
            <div className="relative w-full max-w-4xl bg-bg-section rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
                {/* Nút Đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-text-primary shadow-sm hover:shadow transition-all cursor-pointer"
                >
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="p-8 w-full md:w-2/3 ml-auto"><BookDetailSkeleton /></div>
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
                        {/* BÊN TRÁI: Ảnh bìa sách */}
                        <div className="w-full md:w-2/5 bg-gray-100 flex items-center justify-center p-6 h-full min-h-[400px]">
                            <div className="relative w-full aspect-3/4 shadow-lg rounded-lg overflow-hidden bg-white">
                                <img
                                    src={book.coverImage || FALLBACK_IMAGES.bookPlaceholder}
                                    alt={book.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = FALLBACK_IMAGES.bookPlaceholder;
                                    }}
                                />
                            </div>
                        </div>

                        {/* BÊN PHẢI: Thông tin chi tiết */}
                        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col h-full overflow-hidden">
                            {/* Phần đầu: Tiêu đề & Tác giả */}
                            <div className="shrink-0 space-y-2 mb-4">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    {book.categoryName}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight" title={book.title}>
                                    {book.title}
                                </h1>
                                <p className="text-lg text-text-sub font-medium truncate">
                                    {book.author}
                                </p>
                            </div>

                            {/* Lưới thông tin bổ sung */}
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
                            </div>

                            {/* Mô tả - Chiều cao linh hoạt với giới hạn dòng */}
                            <div className="flex-1 min-h-0 relative mb-6">
                                <h3 className="text-sm font-semibold text-text-primary mb-2">Mô tả</h3>
                                <ExpandableText
                                    content={book.description}
                                    maxLength={420}
                                    className="text-sm text-text-sub leading-relaxed"
                                />
                            </div>

                            {/* Các nút hành động - Cố định ở đáy */}
                            <div className="shrink-0 flex gap-3 mt-auto">
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={() => {
                                        onClose();
                                        navigate(`/books/${book.id}`);
                                    }}
                                    disabled={actionLoading}
                                >
                                    Xem chi tiết sách
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

            {/* Modal xác nhận mượn sách */}
            <BorrowConfirmationModal
                isOpen={isBorrowConfirmOpen}
                onClose={() => setIsBorrowConfirmOpen(false)}
                bookInfo={borrowInfo}
                onConfirm={handleConfirmBorrow}
            />

            {/* Thông báo Toast (Dùng cho cả thành công và cảnh báo giới hạn mượn) */}
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
