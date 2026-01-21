// ==========================================
// Page: Bookshelf
// Mô tả: Trang kệ sách - hiển thị các sách đang giữ (book holds) từ API
// Features: Component-based, ConfirmModal, normalized data
// Vị trí: src/pages/user/Bookshelf.jsx
// ==========================================

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Plus, Trash2, RefreshCw, ShoppingCart, AlertTriangle } from 'lucide-react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import BookCard from '../../components/ui/BookCardUser';
import Button from '../../components/ui/Button';
import BorrowAllModal from '../../components/ui/BorrowAllModal';
import Toast from '../../components/ui/Toast';
import useBookHold from '../../hooks/useBookHold';

// ==========================================
// Loading Skeleton
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
// Confirm Delete Modal
// ==========================================

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, bookTitle, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            />

            {/* Modal */}
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
                        className="flex-1 !bg-error hover:!bg-red-700"
                    >
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// BookshelfItem Component
// ==========================================

const BookshelfItem = ({ hold, onRemove }) => {
    const { id, book, status } = hold;

    return (
        <div className="relative group">
            <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                availableCopies={book.availableCopies}
                showAvailability={true}
            />

            {/* Status Badge */}
            {status && (
                <div className="mt-2 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'ACTIVE'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-text-sub'
                        }`}>
                        {status === 'ACTIVE' ? 'Đang giữ' : status}
                    </span>
                </div>
            )}

            {/* Delete Button Overlay */}
            <button
                onClick={() => onRemove(id, book.title)}
                className="absolute top-2 right-2 p-2 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                aria-label={`Xóa ${book.title} khỏi kệ`}
                title="Xóa khỏi kệ"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

// ==========================================
// Bookshelf Page Component
// ==========================================

const Bookshelf = () => {
    const navigate = useNavigate();

    // Book hold state from hook (normalized data)
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

    // Modal states
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        holdId: null,
        bookTitle: ''
    });

    // Toast state
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // ==========================================
    // Handlers
    // ==========================================

    const showToast = useCallback((type, message) => {
        setToast({ isOpen: true, type, message });
    }, []);

    const handleOpenBorrowModal = useCallback(() => {
        if (isEmpty) {
            showToast('warning', 'Kệ sách trống. Hãy thêm sách vào kệ trước!');
            return;
        }
        setIsBorrowModalOpen(true);
    }, [isEmpty, showToast]);

    const handleConfirmBorrowAll = useCallback(async () => {
        await borrowAllHolds();
        showToast('success', 'Mượn sách thành công! Vui lòng đến thư viện để nhận sách.');
    }, [borrowAllHolds, showToast]);

    // Delete handlers
    const handleRequestDelete = useCallback((holdId, bookTitle) => {
        setDeleteModal({ isOpen: true, holdId, bookTitle });
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setDeleteModal({ isOpen: false, holdId: null, bookTitle: '' });
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        const { holdId } = deleteModal;

        try {
            await removeHold(holdId);
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

    // ==========================================
    // Render
    // ==========================================

    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Single Card Container - Boxed Layout like CategoriesPage */}
                <section className="bg-bg-section rounded-2xl p-6 sm:p-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        {/* Left: Title */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookMarked className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">
                                    Kệ sách
                                </h1>
                                <p className="text-sm text-text-sub">
                                    {loading ? 'Đang tải...' : `${holdCount} cuốn sách đang giữ`}
                                </p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            {/* Refresh Button */}
                            <button
                                onClick={refetch}
                                disabled={loading}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Làm mới"
                            >
                                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>

                            {/* Borrow All Button */}
                            <Button
                                variant="primary"
                                onClick={handleOpenBorrowModal}
                                disabled={isEmpty || actionLoading}
                                leftIcon={<ShoppingCart size={18} />}
                            >
                                MƯỢN SÁCH ({holdCount})
                            </Button>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-600 mb-2">{error}</p>
                            <button
                                onClick={refetch}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && <BookshelfSkeleton />}

                    {/* Books Grid */}
                    {!loading && !error && !isEmpty && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                            {holds.map((hold) => (
                                <BookshelfItem
                                    key={hold.id}
                                    hold={hold}
                                    onRemove={handleRequestDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State - Inline, no extra wrapper */}
                    {!loading && !error && isEmpty && (
                        <div className="py-8 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="inline-flex p-4 bg-primary/10 rounded-full">
                                    <BookMarked className="w-12 h-12 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                                        Kệ sách trống
                                    </h3>
                                    <p className="text-sm text-text-sub mb-6">
                                        Bạn chưa giữ cuốn sách nào. Hãy khám phá và thêm sách yêu thích vào kệ!
                                    </p>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleExplore}
                                    leftIcon={<Plus size={18} />}
                                >
                                    KHÁM PHÁ SÁCH
                                </Button>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Borrow All Modal */}
            <BorrowAllModal
                isOpen={isBorrowModalOpen}
                onClose={() => setIsBorrowModalOpen(false)}
                books={holds}
                onConfirm={handleConfirmBorrowAll}
                loading={actionLoading}
            />

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                bookTitle={deleteModal.bookTitle}
                loading={actionLoading}
            />

            {/* Toast Notification */}
            <Toast
                isOpen={toast.isOpen}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
                duration={3000}
            />
        </div>
    );
};

export default Bookshelf;
