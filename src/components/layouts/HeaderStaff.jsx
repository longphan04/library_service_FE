// ==========================================
// Component: Header
// Mô tả: Header/Navbar responsive cho ứng dụng Library System
// Vị trí: src/components/layouts/Header.jsx
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User,
    Bell,
    LogOut,
    Edit2
} from 'lucide-react';

// Import logo
import Logo from '../../assets/icons/logo.png';

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
const HeaderStaff = () => {
    const navigate = useNavigate();
    const userDropdownRef = useRef(null);

    // Get user data from AuthContext (fetched from API on mount)
    const { user, isLoading: isAuthLoading, logout: authLogout } = useAuth();

    // State quản lý dropdown và modal
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // ==========================================
    // User Display Data (from AuthContext)
    // ==========================================
    const userDisplayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || '';
    const userAvatar = user?.avatar || user?.avatarUrl || DEFAULT_AVATAR;

    // Toggle user dropdown
    const toggleUserDropdown = () => setIsUserDropdownOpen(prev => !prev);

    // Close user dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        console.log('🔴 Logout button clicked');
        setIsUserDropdownOpen(false);
        try {
            console.log('🔴 Calling authLogout...');
            await authLogout();
            console.log('🔴 authLogout completed successfully');
        } catch (error) {
            console.error('🔴 Logout error:', error);
        } finally {
            console.log('🔴 Navigating to /login...');
            // Always navigate to login after logout (success or error)
            navigate('/login', { replace: true });
            console.log('🔴 Navigate called');
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
                            {/* Notification Button */}
                            <button
                                type="button"
                                className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
                                aria-label="Thông báo"
                            >
                                <Bell size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                            </button>

                            {/* User Dropdown */}
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    type="button"
                                    onClick={toggleUserDropdown}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
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
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-left"
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