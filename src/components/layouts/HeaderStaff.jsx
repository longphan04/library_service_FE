// ==========================================
// Component: Header
// Mô tả: Header/Navbar responsive cho ứng dụng Library System
// Vị trí: src/components/layouts/Header.jsx
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    User,
    Bell,
    LogOut,
    Edit2
} from 'lucide-react';

// Import logo
import Logo from '../../assets/icons/logo.png';
import SmallNotificationStaff from '../ui/SmallNotificationStaff';
import useNotiStaff from '../../hooks/useNotiStaff';
import EditProfileModal from '../ui/EditProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { FALLBACK_IMAGES } from '../../utils/imageUrl';

// ==========================================
// Constants
// ==========================================

// Kích thước và style đồng bộ cho các icon
const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 2;

// User dropdown menu items
const USER_MENU_ITEMS = [
];

// Default avatar placeholder
const DEFAULT_AVATAR = FALLBACK_IMAGES.avatar;

// ==========================================
// Header Component
// ==========================================
const HeaderStaff = ({ activeTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userDropdownRef = useRef(null);
    const notiDropdownRef = useRef(null);

    // Get user data from AuthContext (fetched from API on mount)
    const { user, isLoading: isAuthLoading, logout: authLogout } = useAuth();

    // State quản lý dropdown và modal
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const {
        notifications,
        unreadCount,
        hasUnread,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        reset
    } = useNotiStaff();

    // ==========================================
    // Lifecycle & Auto-fetch
    // ==========================================

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
        // Polling every 30s with new notification detection
        const interval = setInterval(() => {
            fetchNotifications(true).then(data => {
                // If there were new unread notifications that we didn't have before
                // it would be handled inside fetchNotifications if we wanted,
                // but let's do a simple count check or ID check here if preferred.
            });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Mark all as read when entering Ticket Management tab
    useEffect(() => {
        if (activeTab === 'tickets' && hasUnread) {
            console.log("Entering Tickets Tab - Marking all as read");
            markAllAsRead();
        }
    }, [activeTab, hasUnread]);

    // Polling handled in useEffect above
    const [lastNotiCount, setLastNotiCount] = useState(0);
    // Detection logic moved to hook for cleaner code
    useEffect(() => {
        setLastNotiCount(unreadCount);
    }, [unreadCount]);


    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
            if (notiDropdownRef.current && !notiDropdownRef.current.contains(event.target)) {
                setIsNotiOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ==========================================
    // Handlers
    // ==========================================

    const toggleUserDropdown = () => setIsUserDropdownOpen(prev => !prev);
    const toggleNotiDropdown = () => {
        const nextState = !isNotiOpen;
        setIsNotiOpen(nextState);
        if (nextState) {
            fetchNotifications();
            if (hasUnread) {
                markAllAsRead();
            }
        }
    };

    const userDisplayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || '';
    const userAvatar = user?.avatar || user?.avatarUrl || DEFAULT_AVATAR;

    // Handle menu item click
    const handleMenuClick = (itemId, link) => {
        setIsUserDropdownOpen(false);

        // Nếu là edit profile, mở modal thay vì navigate
        if (itemId === 'edit-profile') {
            setIsEditModalOpen(true);
        } else {
            navigate(link);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        setIsUserDropdownOpen(false);
        try {
            await authLogout();
        } catch (error) {
            console.error('🔴 Logout error:', error);
        } finally {
            navigate('/login', { replace: true });
        }
    };

    return (
        <header className="bg-bg-section border-b border-border top-0 left-0 right-0 z-50">
            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo Section */}
                        <Link to="/" className="flex items-center gap-3 shrink-0">
                            <img
                                src={Logo}
                                alt="Library System Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-semibold text-primary leading-tight">
                                    Library system
                                </h1>
                                <p className="text-xs text-text-sub leading-tight">
                                    Discover &amp; Borrow book
                                </p>
                            </div>
                        </Link>

                        {/* Right Section - Icons */}
                        <div className="flex items-center gap-2">
                            {/* Notification Dropdown Container */}
                            <div className="relative" ref={notiDropdownRef}>
                                <button
                                    type="button"
                                    onClick={toggleNotiDropdown}
                                    className="relative p-2 rounded-full text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                >
                                    <Bell size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                                    {hasUnread && (
                                        <span className="absolute top-1 right-1 flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown Menu */}
                                {isNotiOpen && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col max-h-[500px]">
                                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                                            <h3 className="font-bold text-lg text-text-primary">Thông báo</h3>
                                            {hasUnread && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-primary font-medium hover:underline"
                                                >
                                                    Đánh dấu tất cả là đã đọc
                                                </button>
                                            )}
                                        </div>

                                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                                            {notifications.length > 0 ? (
                                                notifications.map((noti) => (
                                                    <SmallNotificationStaff
                                                        key={noti.notification_id}
                                                        notification={noti}
                                                        onClick={() => {
                                                            markAsRead(noti.notification_id);
                                                            setIsNotiOpen(false);
                                                            // Navigate to management page if it's a borrow ticket
                                                            if (noti.type === 'BORROW_CREATED' || noti.type === 'WARNING') {
                                                                navigate('/staff/ticket-management');
                                                            }
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <div className="p-10 text-center text-gray-400">
                                                    <Bell size={40} className="mx-auto mb-3 opacity-20" />
                                                    <p>Không có thông báo nào</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Dropdown */}
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    type="button"
                                    onClick={toggleUserDropdown}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
                                    aria-label="Tài khoản"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User size={16} className="text-primary" />
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium text-text-primary">
                                        {userDisplayName}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        {/* User Info Section */}
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                {isAuthLoading ? (
                                                    // Skeleton loading for user info
                                                    <>
                                                        <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
                                                        <div className="flex-1 space-y-2">
                                                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                                                            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <img
                                                            src={userAvatar}
                                                            alt={userDisplayName}
                                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = DEFAULT_AVATAR;
                                                            }}
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-text-primary">
                                                                {userDisplayName}
                                                            </h3>
                                                            <p className="text-sm text-text-sub">
                                                                {userEmail}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            {USER_MENU_ITEMS.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleMenuClick(item.id, item.link)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                                    >
                                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                            <Icon size={18} className="text-primary" />
                                                        </div>
                                                        <span className="text-sm font-medium text-text-primary">
                                                            {item.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Logout Button */}
                                        <div className="border-t border-gray-100 p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-left cursor-pointer"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                    <LogOut size={18} className="text-red-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-red-600">
                                                    Đăng xuất
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    userData={user}
                />
            </div>
        </header>
    );
};

export default HeaderStaff;