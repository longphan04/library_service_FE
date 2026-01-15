// ==========================================
// Component: Header
// Mô tả: Header/Navbar responsive cho ứng dụng Library System
// Vị trí: src/components/layouts/Header.jsx
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    Search,
    User,
    Bell,
    Menu,
    X,
    Clock,
    BookOpen,
    Globe,
    LifeBuoy,
    Bot,
    LogOut,
    ChevronDown,
    Edit2
} from 'lucide-react';

// Import logo
import Logo from '../../assets/icons/logo.png';

// Import SearchBar component
import SearchBar from '../ui/SearchBar';
import EditProfileModal from '../ui/EditProfileModal';
import { useAuth } from '../../contexts/AuthContext';

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

// Mock user data
const MOCK_USER = {
    name: 'User A',
    email: 'UserA@gmail.com',
    avatarUrl: 'https://via.placeholder.com/40/FFB6C1/FFFFFF?text=UA',
};

// User dropdown menu items
const USER_MENU_ITEMS = [
    { id: 'edit-profile', label: 'Chỉnh sửa thông tin cá nhân', icon: Edit2, link: '/profile' },
    { id: 'history', label: 'Lịch sử mượn sách', icon: Clock, link: '/borrow-history' },
    { id: 'bookshelf', label: 'Kệ sách của tôi', icon: BookOpen, link: '/bookshelf' },
    { id: 'language', label: 'Ngôn ngữ', icon: Globe, link: '/settings/language' },
    { id: 'support', label: 'Trung tâm hỗ trợ', icon: LifeBuoy, link: '/support' },
    { id: 'ai-chat', label: 'AI Chat', icon: Bot, link: '/ai-chat' },
];

// ==========================================
// Header Component
// ==========================================
const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout: authLogout } = useAuth();

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
    const [user, setUser] = useState(MOCK_USER);

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
    const handleSearch = (value) => {
        if (value.trim()) {
            // Chuyển đến trang BookSearch với query parameter
            navigate(`/search?q=${encodeURIComponent(value)}`);
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
    const handleSaveProfile = (updatedData) => {
        console.log('Updating profile:', updatedData);

        setUser(prev => ({
            ...prev,
            name: updatedData.name,
            email: updatedData.email,
        }));

        alert('Cập nhật thông tin thành công!');
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
                                                        <img
                                                            src={MOCK_USER.avatarUrl}
                                                            alt={MOCK_USER.name}
                                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-200"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-text-primary">
                                                                {MOCK_USER.name}
                                                            </h3>
                                                            <p className="text-sm text-text-sub">
                                                                {MOCK_USER.email}
                                                            </p>
                                                        </div>
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

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={user}
                onSave={handleSaveProfile}
            />
        </header>
    );
};

export default Header;
