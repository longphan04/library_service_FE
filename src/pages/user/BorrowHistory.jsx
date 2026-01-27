// ==========================================
// Page: BorrowHistory
// Mô tả: Trang lịch sử mượn sách với dữ liệu từ API
// Vị trí: src/pages/user/BorrowHistory.jsx
// ==========================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, RefreshCw, Eye, X, CalendarPlus } from 'lucide-react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import Tab from '../../components/ui/Tab';
import Spinner from '../../components/ui/Spinner';
import Toast from '../../components/ui/Toast';
import { getMyTickets, getById, extendTicket, cancelTicket } from '../../services/borrow-ticket.service';
import { FALLBACK_IMAGES, getBookCoverUrl } from '../../utils/imageUrl';

// ==========================================
// Constants - Status Configuration
// ==========================================
const STATUS_CONFIG = {
    RETURNED: { label: 'Hoàn thành', color: 'bg-status-returned-bg text-status-returned-text' },
    BORROWED: { label: 'Đã mượn', color: 'bg-status-borrowed-bg text-status-borrowed-text' },
    PENDING: { label: 'Đang chờ', color: 'bg-status-pending-bg text-status-pending-text' },
    OVERDUE: { label: 'Quá hạn', color: 'bg-status-overdue-bg text-status-overdue-text' },
    APPROVED: { label: 'Đã duyệt', color: 'bg-status-approved-bg text-status-approved-text' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-status-cancelled-bg text-status-cancelled-text' },
    REJECTED: { label: 'Từ chối', color: 'bg-status-overdue-bg text-status-overdue-text' },
    PICKED_UP: { label: 'Đã mượn', color: 'bg-status-borrowed-bg text-status-borrowed-text' },
    // Lowercase variants for API compatibility
    picked_up: { label: 'Đã mượn', color: 'bg-status-borrowed-bg text-status-borrowed-text' },
    returned: { label: 'Hoàn thành', color: 'bg-status-returned-bg text-status-returned-text' },
    borrowed: { label: 'Đã mượn', color: 'bg-status-borrowed-bg text-status-borrowed-text' },
    pending: { label: 'Đang chờ', color: 'bg-status-pending-bg text-status-pending-text' },
    overdue: { label: 'Quá hạn', color: 'bg-status-overdue-bg text-status-overdue-text' },
    approved: { label: 'Đã duyệt', color: 'bg-status-approved-bg text-status-approved-text' },
    cancelled: { label: 'Đã hủy', color: 'bg-status-cancelled-bg text-status-cancelled-text' },
    rejected: { label: 'Từ chối', color: 'bg-status-overdue-bg text-status-overdue-text' },
};

// Tab configuration
const TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Đang chờ' },
    { key: 'approved', label: 'Đã duyệt' },
    { key: 'borrowed', label: 'Đã mượn' },
    { key: 'returned', label: 'Đã trả' },
    { key: 'overdue', label: 'Quá hạn' },
    { key: 'cancelled', label: 'Đã hủy' },
];

// ==========================================
// Helper Functions
// ==========================================
const formatDate = (dateString) => {
    if (!dateString) return '---';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    } catch {
        return dateString;
    }
};

const calculateBorrowDuration = (borrowDate, dueDate) => {
    if (!borrowDate || !dueDate) return '---';
    try {
        const start = new Date(borrowDate);
        const end = new Date(dueDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} ngày`;
    } catch {
        return '---';
    }
};

// ==========================================
// StatusBadge Component
// ==========================================
const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[status?.toLowerCase()];
    if (!config) {
        return (
            <span className="px-2 py-1 rounded text-xs font-semibold bg-status-cancelled-bg text-status-cancelled-text">
                {status || 'Không rõ'}
            </span>
        );
    }

    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
            {config.label}
        </span>
    );
};

// ==========================================
// Loading Skeleton
// ==========================================
const TableSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-bg-section">
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-16"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-20"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-20"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-16"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-16"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-20"></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b border-border">
                                <td className="px-4 py-3"><div className="h-4 bg-border rounded w-12"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-border rounded w-20"></div></td>
                                <td className="px-4 py-3"><div className="h-6 bg-border rounded w-20"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-border rounded w-16"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-border rounded w-16"></div></td>
                                <td className="px-4 py-3"><div className="h-8 bg-border rounded w-24"></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ==========================================
// TicketDetailModal Component
// ==========================================
const TicketDetailModal = ({ isOpen, onClose, ticketId, onRefreshList }) => {
    const [ticketDetail, setTicketDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // Fetch ticket detail when modal opens
    useEffect(() => {
        if (isOpen && ticketId) {
            fetchTicketDetail();
        }
    }, [isOpen, ticketId]);

    const fetchTicketDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getById(ticketId);
            console.log('[TicketDetailModal] Response:', response);

            // Backend trả về data trực tiếp hoặc qua response.data
            const data = response.data || response;
            setTicketDetail(data);
        } catch (err) {
            console.error('[TicketDetailModal] Error:', err);
            setError(err.message || 'Không thể tải thông tin phiếu mượn');
        } finally {
            setLoading(false);
        }
    };

    const handleExtend = async () => {
        if (!ticketId) return;

        try {
            setActionLoading(true);
            await extendTicket(ticketId);
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Gia hạn phiếu mượn thành công (thêm 10 ngày)!'
            });
            // Tải lại chi tiết để cập nhật ngày mới
            fetchTicketDetail();
            // Thông báo cho component cha cập nhật danh sách
            onRefreshList?.();
        } catch (err) {
            setToast({
                isOpen: true,
                type: 'error',
                message: err.response?.data?.message || err.message || 'Gia hạn thất bại'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!ticketId) return;

        // Thêm xác nhận đơn giản
        if (!window.confirm('Bạn có chắc chắn muốn hủy phiếu mượn này không?')) return;

        try {
            setActionLoading(true);
            await cancelTicket(ticketId);
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Hủy phiếu mượn thành công!'
            });

            // Đợi 1 chút để user thấy thông báo rồi mới refresh/đóng
            setTimeout(() => {
                onRefreshList?.();
                onClose();
            }, 1000);
        } catch (err) {
            setToast({
                isOpen: true,
                type: 'error',
                message: err.response?.data?.message || err.message || 'Hủy phiếu thất bại'
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) return null;

    // Kiểm tra status có thể gia hạn hay không (thường là BORROWED, APPROVED hoặc PICKED_UP)
    const canExtend = ticketDetail && (
        ticketDetail.status?.toUpperCase() === 'BORROWED' ||
        ticketDetail.status?.toUpperCase() === 'PICKED_UP' ||
        ticketDetail.status?.toUpperCase() === 'APPROVED' ||
        ticketDetail.status?.toUpperCase() === 'PENDING'
    );

    // Kiểm tra status có thể hủy hay không (PENDING hoặc APPROVED)
    const isCancelable = ticketDetail && (
        ticketDetail.status?.toUpperCase() === 'PENDING' ||
        ticketDetail.status?.toUpperCase() === 'APPROVED'
    );

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-bg-section">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">
                            Chi tiết phiếu mượn
                        </h2>
                        <p className="text-sm text-text-sub mt-1">
                            Mã phiếu: <span className="font-semibold text-primary">{ticketId}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <Spinner size="lg" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchTicketDetail}
                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {!loading && !error && ticketDetail && (
                        <div className="space-y-6">
                            {/* Ticket Info */}
                            <div className="bg-bg-section rounded-lg p-4 border border-border">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-text-primary">Thông tin phiếu mượn</h3>
                                    <StatusBadge status={ticketDetail.status} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-text-sub font-bold tracking-wider mb-1">Mã phiếu</p>
                                        <p className="font-medium">{ticketDetail.ticket_id || ticketDetail.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-sub font-bold tracking-wider mb-1">Mã đối chiếu</p>
                                        <p className="font-medium">{ticketDetail.ticket_code || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-sub font-bold tracking-wider mb-1">Ngày tạo</p>
                                        <p className="font-medium">{formatDate(ticketDetail.requested_at || ticketDetail.created_at || ticketDetail.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-sub font-bold tracking-wider mb-1">Ngày mượn</p>
                                        <p className="font-medium">{formatDate(ticketDetail.requested_at || ticketDetail.picked_up_at || ticketDetail.approved_at || ticketDetail.borrowed_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-sub font-bold tracking-wider mb-1">Hạn trả (Dự kiến)</p>
                                        <p className="font-medium text-primary">{formatDate(ticketDetail.due_date || ticketDetail.due_at || ticketDetail.dueDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-sub font-bold tracking-wider mb-1">Ngày trả thực tế</p>
                                        <p className="font-medium">{formatDate(ticketDetail.returned_at || ticketDetail.returnDate || ticketDetail.return_date)}</p>
                                    </div>
                                </div>

                                {(canExtend || isCancelable) && (
                                    <div className="mt-5 pt-4 border-t border-border flex flex-row gap-4">
                                        {/* Nút Gia hạn (Đổi sang bên trái) */}
                                        <div className="flex-1">
                                            {canExtend && (
                                                <button
                                                    onClick={handleExtend}
                                                    disabled={actionLoading}
                                                    className={`
                                                        w-full flex items-center justify-center gap-2 px-4 py-2 
                                                        bg-primary text-white rounded-lg 
                                                        font-medium text-sm
                                                        hover:bg-primary-hover transition-all
                                                        ${actionLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}
                                                    `}
                                                >
                                                    {actionLoading ? <Spinner size="sm" light /> : <CalendarPlus size={18} />}
                                                    Gia hạn (10 ngày)
                                                </button>
                                            )}
                                        </div>

                                        {/* Nút Hủy phiếu (Đổi sang bên phải) */}
                                        <div className="flex-1">
                                            {isCancelable && (
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={actionLoading}
                                                    className={`
                                                        w-full flex items-center justify-center gap-2 px-4 py-2 
                                                        bg-red-600 text-white rounded-lg 
                                                        font-medium text-sm
                                                        hover:bg-red-700 transition-all
                                                        ${actionLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 shadow-md shadow-red-200'}
                                                    `}
                                                >
                                                    {actionLoading ? <Spinner size="sm" light /> : <X size={18} />}
                                                    Hủy phiếu
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Books List */}
                            <div>
                                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    Danh sách sách mượn
                                </h3>
                                <div className="space-y-3">
                                    {(ticketDetail.items || ticketDetail.books || []).length > 0 ? (
                                        (ticketDetail.items || ticketDetail.books || []).map((item, index) => {
                                            const bookData = item.book || item;
                                            const copyData = item.copy || {};

                                            return (
                                                <div
                                                    key={item.id || item.book_id || index}
                                                    className="flex items-center gap-4 p-3 bg-white border border-border rounded-xl shadow-sm"
                                                >
                                                    <div className="w-14 h-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-border">
                                                        <img
                                                            src={getBookCoverUrl(bookData.cover_url || bookData.coverImage || bookData.image)}
                                                            alt={bookData.title || 'Sách'}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = FALLBACK_IMAGES.book;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-text-primary truncate" title={bookData.title}>
                                                            {bookData.title || 'Không rõ tên sách'}
                                                        </p>
                                                        <p className="text-sm text-text-sub truncate">
                                                            {bookData.author || (bookData.authors?.[0]?.name) || 'Không rõ tác giả'}
                                                        </p>
                                                        {copyData.copy_id && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] bg-bg-app px-1.5 py-0.5 rounded border border-border font-bold text-text-sub uppercase">
                                                                    ID: {copyData.copy_id}
                                                                </span>
                                                                {item.status && (
                                                                    <span className="text-[10px] text-text-sub italic">
                                                                        ({item.status})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-border">
                                            <p className="text-text-sub text-sm italic">Không tìm thấy thông tin sách trong phiếu.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            {ticketDetail.notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-yellow-800 mb-2 underline decoration-yellow-300">Ghi chú từ thư viện:</h4>
                                    <p className="text-sm text-yellow-700 italic">"{ticketDetail.notes}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-white shadow-inner flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-bg-app border border-border text-text-primary rounded-lg font-bold hover:bg-gray-100 transition-colors active:scale-95 shadow-sm"
                    >
                        Đóng
                    </button>
                </div>

                <Toast
                    isOpen={toast.isOpen}
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ ...toast, isOpen: false })}
                    duration={3000}
                />
            </div>
        </div>
    );
};

// ==========================================
// BorrowHistory Component
// ==========================================
const BorrowHistory = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    const fetchBorrowHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getMyTickets();
            const data = Array.isArray(response) ? response : (response.data || response.tickets || []);

            const transformedData = data.map(ticket => ({
                id: ticket.ticket_id || ticket.id,
                status: ticket.status,
                borrowDate: ticket.requested_at || ticket.picked_up_at || ticket.approved_at || ticket.borrowed_at,
                pickupDate: ticket.picked_up_at || ticket.approved_at || ticket.borrowed_at,
                dueDate: ticket.due_date || ticket.due_at || ticket.dueDate,
                returnDate: ticket.returned_at || ticket.returnDate || ticket.return_date,
            }));

            setBorrowHistory(transformedData);
        } catch (err) {
            console.error('Error fetching borrow history:', err);
            setError(err.message || 'Không thể tải lịch sử mượn sách');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrowHistory();
    }, []);

    const currentTabKey = TABS[activeTab].key;
    const filteredHistory =
        currentTabKey === 'all'
            ? borrowHistory
            : borrowHistory.filter((item) => {
                const itemStatus = (item.status || '').toLowerCase();
                const tabKey = currentTabKey.toLowerCase();

                // Allow PICKED_UP status to appear in 'borrowed' tab
                if (tabKey === 'borrowed') {
                    return itemStatus === 'borrowed' || itemStatus === 'picked_up';
                }

                if (tabKey === 'approved') return itemStatus === 'approved';
                return itemStatus === tabKey;
            });

    const handleRetry = () => {
        fetchBorrowHistory();
    };

    const handleViewDetail = (ticketId) => {
        setSelectedTicketId(ticketId);
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedTicketId(null);
    };

    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Clock size={24} className="text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary">
                                Lịch Sử Mượn Sách
                            </h1>
                        </div>
                    </div>

                    {!loading && (
                        <button
                            onClick={handleRetry}
                            className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                            title="Làm mới"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    )}
                </div>

                <Tab
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="mb-6"
                />

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
                        <p className="text-red-600 mb-2">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {loading && <TableSkeleton />}

                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-bg-section">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Mã phiếu
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Ngày mượn
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Thời hạn mượn
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Ngày trả
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Xem thông tin
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-4 py-12 text-center text-text-sub italic"
                                            >
                                                Không có lịch sử mượn sách
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map((record) => (
                                            <tr
                                                key={record.id}
                                                className="border-b border-border hover:bg-bg-card-hover transition-colors"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-text-primary">
                                                    #{record.id}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {formatDate(record.borrowDate)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={record.status} />
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {calculateBorrowDuration(record.pickupDate, record.dueDate)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {formatDate(record.returnDate)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleViewDetail(record.id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
                                                    >
                                                        <Eye size={16} /> Chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <TicketDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                ticketId={selectedTicketId}
                onRefreshList={fetchBorrowHistory}
            />
        </div>
    );
};

export default BorrowHistory;
