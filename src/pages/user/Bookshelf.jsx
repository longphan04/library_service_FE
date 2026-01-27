// ==========================================
// Page: Bookshelf
// Mô tả: Trang kệ sách - hiển thị các sách đang giữ (book holds) từ API
// Tính năng: Bộ đếm ngược 10 phút, chọn sách mượn (tối đa 5), xóa tự động
// Vị trí: src/pages/user/Bookshelf.jsx
// ==========================================

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Plus, Trash2, RefreshCw, ShoppingCart, AlertTriangle, Clock, Tag } from 'lucide-react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import BookCard from '../../components/ui/BookCardUser';
import Button from '../../components/ui/Button';
import BorrowAllModal from '../../components/ui/BorrowAllModal';
import Toast from '../../components/ui/Toast';
import useBookHold from '../../hooks/useBookHold';

// ==========================================
// Hằng số (Constants)
// ==========================================
const HOLD_EXPIRATION_TIME = 10 * 60 * 1000; // 10 phút tính bằng milliseconds
const MAX_SELECTED_BOOKS = 5; // Giới hạn 5 quyển mỗi lần mượn

// ==========================================
// Component: CountdownTimer
// Mô tả: Hiển thị bộ đếm ngược và tự động gọi callback khi hết giờ
// ==========================================
const CountdownTimer = ({ createdAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!createdAt) return;

        const calculateTimeLeft = () => {
            const start = new Date(createdAt).getTime();
            const now = new Date().getTime();
            const diff = HOLD_EXPIRATION_TIME - (now - start);
            return Math.max(0, diff);
        };

        // Khởi tạo giá trị đầu tiên
        const initial = calculateTimeLeft();
        setTimeLeft(initial);

        if (initial <= 0) {
            onExpire();
            return;
        }

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                onExpire();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [createdAt, onExpire]);

    if (timeLeft === null) return null;

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return (
        <div className="flex items-center gap-1.5 text-error font-medium text-xs mt-1">
            <Clock size={14} />
            <span>
                Còn {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
};

// ==========================================
// Loading Skeleton (Hiệu ứng đang tải)
// ==========================================
const BookshelfSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="aspect-3/4 bg-border rounded-lg mb-2"></div>
                <div className="h-4 bg-border rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-border rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

// ==========================================
// Component: ConfirmDeleteModal (Xác nhận xóa)
// ==========================================
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, bookTitle, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Lớp nền mờ (Backdrop) */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            />

            {/* Nội dung Modal */}
            <div className="relative w-full max-w-sm mx-4 bg-bg-section rounded-2xl shadow-xl p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-error/10 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-error" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Xóa sách khỏi kệ?
                    </h3>
                    <p className="text-sm text-text-sub">
                        Bạn có chắc muốn xóa <span className="font-medium text-text-primary">"{bookTitle}"</span> khỏi kệ sách?
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-error! hover:bg-red-700!"
                    >
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Component: BookshelfItem (Từng cuốn sách trong kệ)
// ==========================================
const BookshelfItem = ({ hold, onRemove, isSelected, onToggleSelect }) => {
    const { id, book, status, createdAt } = hold;

    const handleExpire = useCallback(() => {
        onRemove(id, book.title, true); // true nghĩa là tự động xóa do hết hạn
    }, [id, book.title, onRemove]);

    return (
        <div className="relative group flex flex-col h-full">
            {/* Checkbox chọn sách - Hiển thị đè lên ảnh bìa */}
            <div className="absolute top-2 left-2 z-20">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(id)}
                    className="w-5 h-5 rounded-md border-gray-300 text-primary focus:ring-primary cursor-pointer shadow-sm bg-white/80 backdrop-blur-xs transition-transform hover:scale-110"
                />
            </div>

            {/* Thẻ sách chuẩn - Thêm border nếu đang được chọn */}
            <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                availableCopies={book.availableCopies}
                showAvailability={false}
                onClick={() => onToggleSelect(id)}
                className={`transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
                {/* Thông tin bổ sung */}
                <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-1.5">
                    {/* Danh mục */}
                    <p className="text-xs text-text-sub flex items-center gap-1.5 truncate">
                        <Tag size={12} className="shrink-0" />
                        <span>{book.category}</span>
                    </p>

                    {/* Note */}
                    {book.note && (
                        <p className="text-xs text-text-sub italic bg-gray-50 p-1 rounded border-l-2 border-primary/30 line-clamp-2">
                            "{book.note}"
                        </p>
                    )}

                    {/* Bộ đếm ngược hiển thị bên trong card, dưới dòng status */}
                    <CountdownTimer createdAt={createdAt} onExpire={handleExpire} />
                </div>
            </BookCard>

            {/* Nút xóa nhanh - Overlay ở góc trên phải */}
            <button
                onClick={() => onRemove(id, book.title)}
                className="absolute top-2 right-2 p-2 bg-error/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-700 z-20 hover:scale-110"
                aria-label={`Xóa ${book.title} khỏi kệ`}
                title="Xóa khỏi kệ"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
};

// ==========================================
// Trang chính: Bookshelf (Kệ sách)
// ==========================================
const Bookshelf = () => {
    const navigate = useNavigate();

    // Lấy dữ liệu và các hàm xử lý từ Hook useBookHold
    const {
        holds,
        loading,
        error,
        removeHold,
        borrowAllHolds,
        refetch,
        actionLoading,
        holdCount,
        isEmpty,
    } = useBookHold();

    // Quản lý các sách được chọn để mượn
    const [selectedHoldIds, setSelectedHoldIds] = useState([]);

    // Trạng thái cho các Modal
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        holdId: null,
        bookTitle: '',
        auto: false
    });

    // Trạng thái thông báo Toast (success, error, warning)
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // ==========================================
    // Handlers (Các hàm xử lý sự kiện)
    // ==========================================

    const showToast = useCallback((type, message) => {
        setToast({ isOpen: true, type, message });
    }, []);

    // Xử lý chọn/bỏ chọn sách
    const handleToggleSelect = useCallback((holdId) => {
        setSelectedHoldIds(prev => {
            if (prev.includes(holdId)) {
                return prev.filter(id => id !== holdId);
            }
            if (prev.length >= MAX_SELECTED_BOOKS) {
                showToast('warning', `Bạn chỉ có thể chọn tối đa ${MAX_SELECTED_BOOKS} quyển cho mỗi phiếu mượn.`);
                return prev;
            }
            return [...prev, holdId];
        });
    }, [showToast]);

    // Mở modal xác nhận mượn
    const handleOpenBorrowModal = useCallback(() => {
        if (selectedHoldIds.length === 0) {
            showToast('warning', 'Vui lòng chọn ít nhất một cuốn sách để mượn!');
            return;
        }
        setIsBorrowModalOpen(true);
    }, [selectedHoldIds, showToast]);

    // Xác nhận mượn các sách đã chọn
    const handleConfirmBorrow = useCallback(async () => {
        try {
            await borrowAllHolds(selectedHoldIds);
            showToast('success', 'Mượn sách thành công! Vui lòng đến thư viện để nhận sách.');
            setSelectedHoldIds([]);
        } catch (err) {
            // ==========================================
            // XỬ LÝ LỖI GIỚI HẠN MƯỢN SÁCH (MAX 3 PHIẾU)
            // ==========================================
            const status = err.response?.status;
            const apiMessage = err.response?.data?.message || err.message || '';

            // Kiểm tra các điều kiện để xác định lỗi vượt giới hạn mượn
            const isLimitError =
                (status === 400 || status === 403 || status === 409 || status === 404) &&
                (apiMessage.includes('limit') ||
                    apiMessage.includes('3 phiếu') ||
                    apiMessage.includes('maximum') ||
                    apiMessage.includes('trả sách'));

            if (isLimitError) {
                // Sử dụng Toast màu nâu (warning) để đồng nhất thay vì PopUp
                showToast('warning', 'Bạn đã mượn tối đa 3 phiếu. Vui lòng trả sách để có thể mượn thêm!');
            } else {
                // Các lỗi khác vẫn dùng Toast error
                showToast('error', apiMessage || 'Mượn sách thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsBorrowModalOpen(false);
        }
    }, [selectedHoldIds, borrowAllHolds, showToast]);

    // Xử lý yêu cầu xóa sách
    const handleRequestDelete = useCallback((holdId, bookTitle, auto = false) => {
        if (auto) {
            removeHold(holdId).catch(console.error);
            showToast('info', `Sách "${bookTitle}" đã tự động bị loại bỏ do hết hạn 10 phút.`);
            setSelectedHoldIds(prev => prev.filter(id => id !== holdId));
        } else {
            setDeleteModal({ isOpen: true, holdId, bookTitle, auto: false });
        }
    }, [removeHold, showToast]);

    const handleCloseDeleteModal = useCallback(() => {
        setDeleteModal({ isOpen: false, holdId: null, bookTitle: '', auto: false });
    }, []);

    // Xác nhận xóa sách từ modal
    const handleConfirmDelete = useCallback(async () => {
        const { holdId } = deleteModal;
        try {
            await removeHold(holdId);
            setSelectedHoldIds(prev => prev.filter(id => id !== holdId));
            showToast('success', 'Đã xóa sách khỏi kệ');
        } catch (err) {
            showToast('error', err.message || 'Không thể xóa sách');
        } finally {
            handleCloseDeleteModal();
        }
    }, [deleteModal, removeHold, showToast, handleCloseDeleteModal]);

    const handleExplore = useCallback(() => {
        navigate('/categories');
    }, [navigate]);

    // Lọc danh sách các sách đang được chọn để truyền vào modal mượn
    const selectedBooks = useMemo(() => {
        return holds.filter(h => selectedHoldIds.includes(h.id));
    }, [holds, selectedHoldIds]);

    // ==========================================
    // Render TRANG
    // ==========================================

    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <section className="bg-bg-section rounded-2xl p-6 sm:p-8 shadow-sm">
                    {/* Header của Kệ sách */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <BookMarked className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Kệ sách của bạn</h1>
                                <p className="text-sm text-text-sub">
                                    {loading ? 'Đang cập nhật...' : `${holdCount} cuốn đang giữ • Đã chọn ${selectedHoldIds.length}/${MAX_SELECTED_BOOKS}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={refetch}
                                disabled={loading}
                                className="p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-50 border border-transparent hover:border-primary/20"
                                title="Làm mới"
                            >
                                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>

                            <Button
                                variant="primary"
                                onClick={handleOpenBorrowModal}
                                disabled={selectedHoldIds.length === 0 || actionLoading}
                                leftIcon={<ShoppingCart size={18} />}
                                className="px-6 py-2.5 shadow-lg shadow-primary/20"
                            >
                                MƯỢN SÁCH ({selectedHoldIds.length})
                            </Button>
                        </div>
                    </div>

                    {/* Hiển thị Lỗi */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 flex items-center gap-3 text-error">
                            <AlertTriangle size={20} />
                            <p className="flex-1 text-sm font-medium">{error}</p>
                            <button onClick={refetch} className="underline text-xs hover:text-red-700">Thử lại</button>
                        </div>
                    )}

                    {/* Hiển thị khi đang tải */}
                    {loading && <BookshelfSkeleton />}

                    {/* Hiển thị Grid Sách */}
                    {!loading && !error && !isEmpty && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                            {holds.map((hold) => (
                                <BookshelfItem
                                    key={hold.id}
                                    hold={hold}
                                    onRemove={handleRequestDelete}
                                    isSelected={selectedHoldIds.includes(hold.id)}
                                    onToggleSelect={handleToggleSelect}
                                />
                            ))}
                        </div>
                    )}

                    {/* Trạng thái trống */}
                    {!loading && !error && isEmpty && (
                        <div className="py-20 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="inline-flex p-5 bg-white rounded-full shadow-sm">
                                    <BookMarked className="w-12 h-12 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary mb-2">Kệ sách đang trống</h3>
                                    <p className="text-sm text-text-sub">
                                        Hãy quay lại cửa hàng để tìm và giữ chỗ những cuốn sách bạn yêu thích trước khi chúng hết bản sao nhé.
                                    </p>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleExplore}
                                    leftIcon={<Plus size={18} />}
                                >
                                    KHÁM PHÁ NGAY
                                </Button>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Modal mượn sách đã chọn */}
            <BorrowAllModal
                isOpen={isBorrowModalOpen}
                onClose={() => setIsBorrowModalOpen(false)}
                books={selectedBooks}
                onConfirm={handleConfirmBorrow}
                loading={actionLoading}
                loanPeriod={10}
            />

            {/* Modal xác nhận xóa */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                bookTitle={deleteModal.bookTitle}
                loading={actionLoading}
            />

            {/* Thông báo Toast (success, error, warning) */}
            <Toast
                isOpen={toast.isOpen}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
                duration={3000}
            />

            <Footer />
        </div>
    );
};

export default Bookshelf;
