// ==========================================
// Page: BorrowHistory
// Mô tả: Trang lịch sử mượn sách với tab filtering
// Vị trí: src/pages/user/BorrowHistory.jsx
// ==========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Header from '../../componants/layouts/Header';
import Tab from '../../componants/ui/Tab';
import Badge from '../../componants/ui/Badge';

// ==========================================
// Constants - Status Configuration
// ==========================================
const STATUS_CONFIG = {
    returned: { label: 'Xong thành', color: 'bg-green-100 text-green-800' },
    borrowed: { label: 'Đang mượn', color: 'bg-blue-100 text-blue-800' },
    pending: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
    overdue: { label: 'Quá hạn', color: 'bg-red-100 text-red-800' },
    incomplete: { label: 'Chưa hoàn', color: 'bg-orange-100 text-orange-800' },
    cancelled: { label: 'Hủy mượn', color: 'bg-gray-100 text-gray-800' },
};

// Tab configuration
const TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Đang chờ' },
    { key: 'approved', label: 'Đã chấp nhận' },
    { key: 'borrowed', label: 'Đã mượn' },
    { key: 'returned', label: 'Đã trả' },
    { key: 'overdue', label: 'Quá hạn' },
    { key: 'cancelled', label: 'Đã hủy' },
];

// ==========================================
// Mock Data - Sample Borrow History
// ==========================================
const MOCK_BORROW_HISTORY = [
    {
        id: 'A001',
        bookId: 'book-1',
        bookTitle: 'Lịch sử Việt Nam',
        borrowDate: '29/01/2025',
        status: 'returned',
        borrowedDays: '60 ngày',
        returnDate: '02/03/2025',
        dueDate: '05/03/2025',
    },
    {
        id: 'A002',
        bookId: 'book-2',
        bookTitle: 'Truyện Kiều',
        borrowDate: '29/01/2025',
        status: 'borrowed',
        borrowedDays: '--- ngày',
        returnDate: '------------',
        dueDate: '05/03/2025',
    },
    {
        id: 'A003',
        bookId: 'book-3',
        bookTitle: 'Số đỏ',
        borrowDate: '29/01/2025',
        status: 'pending',
        borrowedDays: '--- ngày',
        returnDate: '------------',
        dueDate: '05/03/2025',
    },
    {
        id: 'A004',
        bookId: 'book-4',
        bookTitle: 'Chí Phèo',
        borrowDate: '29/01/2025',
        status: 'overdue',
        borrowedDays: '--- ngày',
        returnDate: '------------',
        dueDate: '05/03/2025',
    },
    {
        id: 'A005',
        bookId: 'book-5',
        bookTitle: 'Lão Hạc',
        borrowDate: '15/01/2025',
        status: 'incomplete',
        borrowedDays: '30 ngày',
        returnDate: '------------',
        dueDate: '01/03/2025',
    },
    {
        id: 'A006',
        bookId: 'book-6',
        bookTitle: 'Tắt đèn',
        borrowDate: '10/01/2025',
        status: 'cancelled',
        borrowedDays: '--- ngày',
        returnDate: '------------',
        dueDate: '------------',
    },
];

// ==========================================
// StatusBadge Component
// ==========================================
const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;

    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
            {config.label}
        </span>
    );
};

// ==========================================
// BorrowHistory Component
// ==========================================
const BorrowHistory = () => {
    const [activeTab, setActiveTab] = useState(0);

    // Filter data based on active tab
    const currentTabKey = TABS[activeTab].key;
    const filteredHistory =
        currentTabKey === 'all'
            ? MOCK_BORROW_HISTORY
            : MOCK_BORROW_HISTORY.filter((item) => {
                // Map tab keys to status values
                const statusMap = {
                    pending: 'pending',
                    approved: 'borrowed', // Đã chấp nhận ~ Đang mượn
                    borrowed: 'borrowed',
                    returned: 'returned',
                    overdue: 'overdue',
                    cancelled: 'cancelled',
                };
                return item.status === statusMap[currentTabKey];
            });

    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center gap-4 mb-8">
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

                {/* Tab Navigation */}
                <Tab
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="mb-6"
                />

                {/* Borrow History Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-bg-section">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                        Mã sách
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
                                        Đã trả
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                        Ngày trả
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                                        Hành động
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
                                            <td className="px-4 py-3 text-sm text-text-primary">
                                                {record.borrowDate}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={record.status} />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-text-primary">
                                                {record.borrowedDays}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-text-primary">
                                                {record.returnDate}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-text-primary">
                                                {record.dueDate}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button className="text-sm text-primary hover:underline font-medium">
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Info */}
                {filteredHistory.length > 0 && (
                    <div className="mt-4 text-sm text-text-sub">
                        Hiển thị {filteredHistory.length} kết quả
                    </div>
                )}
            </main>
        </div>
    );
};

export default BorrowHistory;
