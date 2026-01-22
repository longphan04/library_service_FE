// ==========================================
// Page: BorrowHistory
// Mô tả: Trang lịch sử mượn sách với dữ liệu từ API
// Vị trí: src/pages/user/BorrowHistory.jsx
// ==========================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, RefreshCw, Eye, X } from 'lucide-react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import Tab from '../../components/ui/Tab';
import Spinner from '../../components/ui/Spinner';
import { getMyTickets, getById } from '../../services/borrow-ticket.service';
import { FALLBACK_IMAGES, getBookCoverUrl } from '../../utils/imageUrl';

// ==========================================
// Constants - Status Configuration
// ==========================================
const STATUS_CONFIG = {
    RETURNED: { label: 'Hoàn thành', color: 'bg-status-returned-bg text-status-returned-text' },
    BORROWED: { label: 'Đang mượn', color: 'bg-status-borrowed-bg text-status-borrowed-text' },
    PENDING: { label: 'Đang chờ', color: 'bg-status-pending-bg text-status-pending-text' },
    OVERDUE: { label: 'Quá hạn', color: 'bg-status-overdue-bg text-status-overdue-text' },
    APPROVED: { label: 'Đã duyệt', color: 'bg-status-approved-bg text-status-approved-text' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-status-cancelled-bg text-status-cancelled-text' },
    REJECTED: { label: 'Từ chối', color: 'bg-status-overdue-bg text-status-overdue-text' },
    // Lowercase variants for API compatibility
    returned: { label: 'Hoàn thành', color: 'bg-status-returned-bg text-status-returned-text' },
    borrowed: { label: 'Đang mượn', color: 'bg-status-borrowed-bg text-status-borrowed-text' },
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
    { key: 'borrowed', label: 'Đang mượn' },
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
const TicketDetailModal = ({ isOpen, onClose, ticketId }) => {
    const [ticketDetail, setTicketDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch ticket detail when modal opens
    useEffect(() => {
        if (isOpen && ticketId) {
            fetchTicketDetail();
        }
        return () => {
            // Reset state when modal closes
            if (!isOpen) {
                setTicketDetail(null);
                setError(null);
            }
        };
    }, [isOpen, ticketId]);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const fetchTicketDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getById(ticketId);
            console.log('[TicketDetailModal] Response:', response);
            // Handle different response formats
            const data = response.data || response;
            setTicketDetail(data);
        } catch (err) {
            console.error('[TicketDetailModal] Error:', err);
            setError(err.message || 'Không thể tải thông tin phiếu mượn');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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

                    {error && (
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
                            <div className="bg-bg-section rounded-lg p-4">
                                <h3 className="font-semibold text-text-primary mb-4">Thông tin phiếu mượn</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-text-sub">Mã phiếu</p>
                                        <p className="font-medium">{ticketDetail.id || ticketDetail.ticket_id || ticketId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-sub">Trạng thái</p>
                                        <StatusBadge status={ticketDetail.status} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-sub">Ngày tạo</p>
                                        <p className="font-medium">{formatDate(ticketDetail.createdAt || ticketDetail.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-sub">Ngày mượn</p>
                                        <p className="font-medium">{formatDate(ticketDetail.borrowDate || ticketDetail.borrow_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-sub">Hạn trả</p>
                                        <p className="font-medium">{formatDate(ticketDetail.dueDate || ticketDetail.due_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-sub">Ngày trả thực tế</p>
                                        <p className="font-medium">{formatDate(ticketDetail.returnDate || ticketDetail.return_date)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Books List */}
                            <div>
                                <h3 className="font-semibold text-text-primary mb-4">Danh sách sách</h3>
                                <div className="space-y-3">
                                    {(ticketDetail.books || ticketDetail.book_copies || []).length > 0 ? (
                                        (ticketDetail.books || ticketDetail.book_copies || []).map((book, index) => (
                                            <div
                                                key={book.id || book.book_id || book.copy_id || index}
                                                className="flex items-center gap-4 p-3 bg-bg-section rounded-lg"
                                            >
                                                <img
                                                    src={getBookCoverUrl(book.cover_url || book.coverImage || book.image)}
                                                    alt={book.title || book.book_title || 'Sách'}
                                                    className="w-12 h-16 object-cover rounded shadow"
                                                    onError={(e) => {
                                                        e.target.src = FALLBACK_IMAGES.book;
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-text-primary">
                                                        {book.title || book.book_title || 'Không rõ tên sách'}
                                                    </p>
                                                    <p className="text-sm text-text-sub">
                                                        {book.author || book.authors?.[0]?.name || 'Không rõ tác giả'}
                                                    </p>
                                                    {book.copy_id && (
                                                        <p className="text-xs text-text-sub">
                                                            Mã bản sao: {book.copy_id}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-text-sub text-sm text-center py-4">
                                            Không có thông tin sách
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Notes if any */}
                            {ticketDetail.notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-800 mb-2">Ghi chú</h4>
                                    <p className="text-sm text-yellow-700">{ticketDetail.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
                    >
                        Đóng
                    </button>
                </div>
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

    // Modal state
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    // Fetch borrow history from API
    const fetchBorrowHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getMyTickets();

            // Handle different API response formats
            const data = Array.isArray(response) ? response : response.data || response.tickets || [];

            // Transform data to expected format
            const transformedData = data.map(ticket => ({
                id: ticket.id || ticket._id || ticket.ticket_id,
                bookId: ticket.bookId || ticket.book?.id || ticket.book?._id,
                borrowDate: ticket.borrowDate || ticket.borrow_date || ticket.createdAt || ticket.created_at,
                status: ticket.status,
                returnDate: ticket.returnDate || ticket.return_date || ticket.actualReturnDate,
                dueDate: ticket.dueDate || ticket.due_date || ticket.expectedReturnDate,
            }));

            setBorrowHistory(transformedData);
        } catch (err) {
            console.error('Error fetching borrow history:', err);
            setError(err.message || 'Không thể tải lịch sử mượn sách');
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchBorrowHistory();
    }, []);

    // Filter data based on active tab
    const currentTabKey = TABS[activeTab].key;
    const filteredHistory =
        currentTabKey === 'all'
            ? borrowHistory
            : borrowHistory.filter((item) => {
                const itemStatus = (item.status || '').toLowerCase();
                const tabKey = currentTabKey.toLowerCase();

                // Handle status mapping
                if (tabKey === 'approved') {
                    return itemStatus === 'approved';
                }
                return itemStatus === tabKey;
            });

    // Handle retry
    const handleRetry = () => {
        fetchBorrowHistory();
    };

    // Handle view detail
    const handleViewDetail = (ticketId) => {
        setSelectedTicketId(ticketId);
        setIsDetailModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedTicketId(null);
    };

    return (
        <div className="min-h-screen bg-bg-app flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content - flex-1 để fill còn lại */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
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

                    {/* Refresh Button */}
                    {!loading && (
                        <button
                            onClick={handleRetry}
                            className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                            title="Làm mới"
                        >
                            <RefreshCw size={20} />
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <Tab
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="mb-6"
                />

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600 mb-2">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && <TableSkeleton />}

                {/* Borrow History Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                                                className="px-4 py-12 text-center text-text-sub"
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
                                                    {record.id}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {formatDate(record.borrowDate)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={record.status} />
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {calculateBorrowDuration(record.borrowDate, record.dueDate)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {formatDate(record.returnDate)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleViewDetail(record.id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                        Xem chi tiết
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

                {/* Summary Info */}
                {!loading && !error && filteredHistory.length > 0 && (
                    <div className="mt-4 text-sm text-text-sub">
                        Hiển thị {filteredHistory.length} kết quả
                    </div>
                )}
            </main>

            {/* Footer - Sticky ở cuối trang */}
            <Footer />

            {/* Ticket Detail Modal */}
            <TicketDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                ticketId={selectedTicketId}
            />
        </div>
    );
};

export default BorrowHistory;
