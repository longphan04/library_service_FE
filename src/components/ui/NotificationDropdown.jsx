// ==========================================
// Component: NotificationDropdown
// Mô tả: Dropdown hiển thị danh sách thông báo khi click vào icon chuông
// Vị trí: src/components/ui/NotificationDropdown.jsx
// ==========================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Clock, CheckCircle } from 'lucide-react';
import { getNotifications } from '../../services/notification.service';

// ==========================================
// Constants
// ==========================================
const MAX_NOTIFICATIONS = 10;
const LOCAL_STORAGE_KEY = 'notification_read_ids';

// ==========================================
// Helper Functions
// ==========================================

/**
 * Format thời gian thông báo thành dạng đọc được
 */
const formatTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });
};

/**
 * Lấy danh sách ID thông báo đã đọc từ localStorage
 */
const getReadIds = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

/**
 * Lưu danh sách ID thông báo đã đọc vào localStorage
 */
const setReadIds = (ids) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
        console.error('[NotificationDropdown] Failed to save read IDs:', e);
    }
};

// ==========================================
// NotificationDropdown Component
// ==========================================
const NotificationDropdown = ({ iconSize = 20, iconStrokeWidth = 2 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [readIds, setReadIdsState] = useState(() => getReadIds());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    // Tính số thông báo chưa đọc
    const unreadCount = notifications.filter(n => {
        const id = n.notification_id || n.id;
        return !readIds.includes(id);
    }).length;

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNotifications();
            setNotifications(data.slice(0, MAX_NOTIFICATIONS));
        } catch (err) {
            setError('Không thể tải thông báo');
            console.error('[NotificationDropdown] Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [fetchNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Khi đóng dropdown, đánh dấu tất cả là đã đọc
                if (isOpen && notifications.length > 0) {
                    markAllAsRead();
                }
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, notifications]);

    // Toggle dropdown
    const toggleDropdown = () => {
        if (isOpen) {
            // Đóng dropdown - đánh dấu tất cả đã đọc
            markAllAsRead();
        }
        setIsOpen(!isOpen);
    };

    // Đánh dấu tất cả thông báo là đã đọc
    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.notification_id || n.id);
        const newReadIds = [...new Set([...readIds, ...allIds])];
        setReadIdsState(newReadIds);
        setReadIds(newReadIds);
    };

    // Kiểm tra xem thông báo có phải là chưa đọc không
    const isUnread = (notification) => {
        const id = notification.notification_id || notification.id;
        return !readIds.includes(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button với Red Dot */}
            <button
                type="button"
                onClick={toggleDropdown}
                className={`relative p-2 rounded-full transition-colors ${isOpen
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-primary/10'
                    }`}
                aria-label="Thông báo"
            >
                <Bell size={iconSize} strokeWidth={iconStrokeWidth} />

                {/* Red Dot - Hiển thị khi có thông báo chưa đọc */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    style={{ animation: 'fadeSlideDown 200ms ease-out' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-bg-section">
                        <h3 className="font-bold text-text-primary flex items-center gap-2">
                            <Bell size={18} className="text-primary" />
                            Thông báo
                            {unreadCount > 0 && (
                                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                    {unreadCount} mới
                                </span>
                            )}
                        </h3>
                        <button
                            onClick={() => {
                                markAllAsRead();
                                setIsOpen(false);
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Đóng"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading && (
                            <div className="p-8 text-center">
                                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                                <p className="text-sm text-text-sub mt-2">Đang tải...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="p-6 text-center">
                                <p className="text-sm text-red-500">{error}</p>
                                <button
                                    onClick={fetchNotifications}
                                    className="mt-2 text-sm text-primary hover:underline"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {!loading && !error && notifications.length === 0 && (
                            <div className="p-8 text-center">
                                <Bell size={40} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-text-sub">Không có thông báo nào</p>
                            </div>
                        )}

                        {!loading && !error && notifications.length > 0 && (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => {
                                    const id = notification.notification_id || notification.id;
                                    const unread = isUnread(notification);

                                    return (
                                        <div
                                            key={id}
                                            className={`p-4 transition-colors ${unread
                                                ? 'bg-primary/5 hover:bg-primary/10'
                                                : 'bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon */}
                                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${unread ? 'bg-primary/20' : 'bg-gray-100'
                                                    }`}>
                                                    {unread ? (
                                                        <Clock size={18} className="text-primary" />
                                                    ) : (
                                                        <CheckCircle size={18} className="text-gray-400" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold mb-1 ${unread ? 'text-text-primary' : 'text-text-sub'
                                                        }`}>
                                                        {notification.title || 'Thông báo'}
                                                    </p>
                                                    <p className={`text-sm leading-relaxed ${unread ? 'text-text-primary' : 'text-text-sub'
                                                        }`}>
                                                        {notification.content || notification.message || notification.body || ''}
                                                    </p>
                                                    <p className="text-xs text-text-sub mt-1.5 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatTime(notification.created_at || notification.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Unread indicator dot */}
                                                {unread && (
                                                    <span className="shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                            <p className="text-xs text-text-sub">
                                Hiển thị {notifications.length} thông báo gần nhất
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
