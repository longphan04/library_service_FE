// ==========================================
// Component: Header
// Mô tả: Header/Navbar responsive cho ứng dụng Library System
// Vị trí: src/components/layouts/Header.jsx
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';
import authService from '../../services/auth.service';
import categoryService from '../../services/category.service';
import usePrefetch from '../../hooks/usePrefetch';
import {
    Search,
    User,
    Bell,
    Menu,
    X,
    Clock,
    BookOpen,
    LogOut,
    ChevronDown,
    Edit2
} from 'lucide-react';

// Import logo
import Logo from '../../assets/icons/logo.png';

// Import SearchBar component
import SearchBar from '../ui/SearchBar';
import EditProfileModal from '../ui/EditProfileModal';
import NotificationDropdown from '../ui/NotificationDropdown';
import Toast from '../ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { FALLBACK_IMAGES } from '../../utils/imageUrl';

// ==========================================
// Constants
// ==========================================

// Kích thước và style đồng bộ cho các icon
const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 2;

// Danh sách các mục menu điều hướng
const NAV_ITEMS = [
    { label: 'Trang Chủ', path: '/' },
    { label: 'Danh mục', path: '/categories' },
    { label: 'Kệ sách', path: '/bookshelf' },
];

// User dropdown menu items
const USER_MENU_ITEMS = [
    { id: 'edit-profile', label: 'Chỉnh sửa thông tin cá nhân', icon: Edit2, link: '/profile' },
    { id: 'history', label: 'Lịch sử mượn sách', icon: Clock, link: '/borrow-history' },
    { id: 'bookshelf', label: 'Kệ sách của tôi', icon: BookOpen, link: '/bookshelf' },
];

// Default avatar placeholder
const DEFAULT_AVATAR = FALLBACK_IMAGES.avatarPlaceholder;

// ==========================================
// Header Component
// ==========================================
const Header = () => {
    const navigate = useNavigate();
    const { prefetch } = usePrefetch();

    // Get user data from AuthContext (fetched from API on mount)
    const { isAuthenticated, user, isLoading: isAuthLoading, logout: authLogout, updateUser } = useAuth();

    // State quản lý mobile menu mở/đóng
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State quản lý hiển thị thanh search
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // State lưu giá trị search
    const [searchValue, setSearchValue] = useState('');

    // State quản lý user dropdown
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);

    // State quản lý edit profile modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // State quản lý toast
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // ==========================================
    // User Display Data (from AuthContext)
    // ==========================================
    const userDisplayName = user?.full_name || user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || '';
    const userAvatar = user?.avatar || user?.avatarUrl || DEFAULT_AVATAR;

    // Toggle mobile menu
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    // Đóng mobile menu khi click vào nav item
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Toggle search bar
    const toggleSearch = () => setIsSearchOpen(prev => !prev);

    // Đóng search bar
    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchValue('');
    };

    // Xử lý tìm kiếm
    const handleSearch = (value, sources = []) => {
        if (value.trim()) {
            // Nếu có sources từ AI, truyền vào state
            const searchParams = new URLSearchParams();
            searchParams.set('q', value);

            if (sources && sources.length > 0) {
                // Pass sources data để trang search hiển thị
                navigate(`/search?q=${encodeURIComponent(value)}`, {
                    state: { sources }
                });
            } else {
                navigate(`/search?q=${encodeURIComponent(value)}`);
            }
            closeSearch();
        }
    };

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

    // Handle save profile
    const handleSaveProfile = async (updatedData) => {
        try {
            console.log('Updating profile:', updatedData);

            // 1. Update Profile Info (Name/Email)
            if (updatedData.name || updatedData.email) {
                const profileUpdatePayload = {
                    full_name: updatedData.name, // Map name to full_name for backend
                    email: updatedData.email
                };

                await userService.updateMe(profileUpdatePayload);

                // Update local context
                // Note: We update both fullName and full_name to ensure Headers display correctly
                updateUser({
                    full_name: updatedData.name,
                    fullName: updatedData.name,
                    email: updatedData.email
                });
            }

            // 2. Change Password (if provided)
            if (updatedData.password) {
                // Backend requires currentPassword for security
                await authService.changePassword({
                    currentPassword: updatedData.currentPassword,
                    newPassword: updatedData.password
                });
            }

            setToast({
                isOpen: true,
                type: 'success',
                message: 'Cập nhật thông tin thành công!'
            });
            setIsUserDropdownOpen(false);

        } catch (error) {
            console.error('Update profile failed:', error);
            setToast({
                isOpen: true,
                type: 'error',
                message: error.message || 'Cập nhật thất bại'
            });
        }
    };

    // Handle logout
    const handleLogout = async () => {
        setIsUserDropdownOpen(false);
        await authLogout();
        navigate('/login');
    };

    return (
        <header className="bg-bg-section border-b border-border sticky top-0 z-50">
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

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {NAV_ITEMS.filter(item => {
                                // Ẩn "Kệ sách" nếu user chưa đăng nhập
                                if (item.path === '/bookshelf' && !isAuthenticated) {
                                    return false;
                                }
                                return true;
                            }).map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onMouseEnter={() => {
                                        if (item.path === '/categories') {
                                            prefetch('categories-all', () => categoryService.getAll());
                                        }
                                    }}
                                    onFocus={() => {
                                        if (item.path === '/categories') {
                                            prefetch('categories-all', () => categoryService.getAll());
                                        }
                                    }}
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-text-primary'
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right Section - Icons */}
                        <div className="flex items-center gap-2">
                            {/* Search Button - Available for everyone */}
                            <button
                                type="button"
                                onClick={toggleSearch}
                                className={`p-2 rounded-full transition-colors ${isSearchOpen
                                    ? 'bg-primary text-white'
                                    : 'text-primary hover:bg-primary/10'
                                    }`}
                                aria-label="Tìm kiếm"
                            >
                                <Search size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                            </button>

                            {isAuthenticated ? (
                                // Authenticated User UI
                                <>
                                    {/* Notification Dropdown */}
                                    <NotificationDropdown
                                        iconSize={ICON_SIZE}
                                        iconStrokeWidth={ICON_STROKE_WIDTH}
                                    />

                                    {/* User Dropdown */}
                                    <div className="relative" ref={userDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={toggleUserDropdown}
                                            className="p-2 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors"
                                            aria-label="Tài khoản"
                                        >
                                            <User size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
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
                                </>
                            ) : (
                                // Guest User UI
                                <>
                                    {/* Login Button */}
                                    <Link to="/login">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        >
                                            Đăng nhập
                                        </button>
                                    </Link>

                                    {/* Register Button */}
                                    <Link to="/register">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-hover rounded-lg transition-colors"
                                        >
                                            Đăng ký
                                        </button>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                type="button"
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-full text-primary hover:bg-primary/10 transition-colors ml-1"
                                aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                            >
                                {isMobileMenuOpen ? (
                                    <X size={ICON_SIZE + 4} strokeWidth={ICON_STROKE_WIDTH} />
                                ) : (
                                    <Menu size={ICON_SIZE + 4} strokeWidth={ICON_STROKE_WIDTH} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar Panel - Overlay hiển thị khi click vào icon search */}
                {isSearchOpen && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border-t border-b border-border px-4 py-3 shadow-md z-50"
                        style={{
                            animation: 'fadeSlideDown 200ms ease-out'
                        }}
                    >
                        <div className="max-w-3xl mx-auto">
                            <SearchBar
                                value={searchValue}
                                onChange={setSearchValue}
                                onSearch={handleSearch}
                                onClose={closeSearch}
                                placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-bg-section border-t border-border">
                    <div className="px-4 py-4 space-y-2">
                        {NAV_ITEMS.filter(item => {
                            // Ẩn "Kệ sách" nếu user chưa đăng nhập
                            if (item.path === '/bookshelf' && !isAuthenticated) {
                                return false;
                            }
                            return true;
                        }).map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `block py-2 px-4 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'text-primary bg-primary/10'
                                        : 'text-text-primary hover:bg-gray-100'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            )}

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={user}
                onSave={handleSaveProfile}
            />

            {/* Toast Notification */}
            <Toast
                isOpen={toast.isOpen}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, isOpen: false })}
                duration={3000}
            />
        </header>
    );
};

export default Header;
