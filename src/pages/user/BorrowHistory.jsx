// ==========================================
// Page: BorrowHistory
// Mô tả: Trang lịch sử mượn sách với dữ liệu từ API
// Vị trí: src/pages/user/BorrowHistory.jsx
// ==========================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react';
import Header from '../../componants/layouts/Header';
import Tab from '../../componants/ui/Tab';
import borrowTicketService from '../../services/borrow-ticket.service';

// ==========================================
// Constants - Status Configuration
// ==========================================
const STATUS_CONFIG = {
    RETURNED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    BORROWED: { label: 'Đang mượn', color: 'bg-blue-100 text-blue-800' },
    PENDING: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
    OVERDUE: { label: 'Quá hạn', color: 'bg-red-100 text-red-800' },
    APPROVED: { label: 'Đã duyệt', color: 'bg-indigo-100 text-indigo-800' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' },
    REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
    // Lowercase variants for API compatibility
    returned: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    borrowed: { label: 'Đang mượn', color: 'bg-blue-100 text-blue-800' },
    pending: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
    overdue: { label: 'Quá hạn', color: 'bg-red-100 text-red-800' },
    approved: { label: 'Đã duyệt', color: 'bg-indigo-100 text-indigo-800' },
    cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' },
    rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
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

const calculateBorrowedDays = (borrowDate, returnDate) => {
    if (!borrowDate) return '---';
    try {
        const start = new Date(borrowDate);
        const end = returnDate ? new Date(returnDate) : new Date();
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
            <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
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
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-24"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-16"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-16"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-20"></div></th>
                            <th className="px-4 py-3 text-left"><div className="h-4 bg-border rounded w-16"></div></th>
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
                                <td className="px-4 py-3"><div className="h-4 bg-border rounded w-20"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-border rounded w-12"></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ==========================================
// BorrowHistory Component
// ==========================================
const BorrowHistory = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch borrow history from API
    const fetchBorrowHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await borrowTicketService.getMyTickets();

            // Handle different API response formats
            const data = Array.isArray(response) ? response : response.data || response.tickets || [];

            // Transform data to expected format
            const transformedData = data.map(ticket => ({
                id: ticket.id || ticket._id || ticket.ticketId,
                bookId: ticket.bookId || ticket.book?.id || ticket.book?._id,
                bookTitle: ticket.bookTitle || ticket.book?.title || 'Không rõ',
                borrowDate: ticket.borrowDate || ticket.createdAt,
                status: ticket.status,
                returnDate: ticket.returnDate || ticket.actualReturnDate,
                dueDate: ticket.dueDate || ticket.expectedReturnDate,
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

    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                            Tên sách
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Ngày mượn
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Đã mượn
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Ngày trả
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                            Hạn trả
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
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
                                                <td className="px-4 py-3 text-sm text-text-primary max-w-[200px] truncate">
                                                    {record.bookTitle}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {formatDate(record.borrowDate)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={record.status} />
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {calculateBorrowedDays(record.borrowDate, record.returnDate)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {formatDate(record.returnDate)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-text-primary">
                                                    {formatDate(record.dueDate)}
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
        </div>
    );
};

export default BorrowHistory;
