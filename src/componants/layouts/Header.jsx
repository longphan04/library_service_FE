// ==========================================
// Component: Header
// Mô tả: Header/Navbar responsive cho ứng dụng Library System
// Vị trí: src/components/layouts/Header.jsx
// ==========================================

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, User, Bell, Menu, X } from 'lucide-react';

// Import logo
import Logo from '../../assets/icons/logo.png';

// Import SearchBar component
import SearchBar from '../ui/SearchBar';

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

// ==========================================
// Header Component
// ==========================================
const Header = () => {
    // State quản lý mobile menu mở/đóng
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State quản lý hiển thị thanh search
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // State lưu giá trị search
    const [searchValue, setSearchValue] = useState('');

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
        console.log('Searching for:', value);
        // TODO: Thêm logic tìm kiếm ở đây
    };

    return (
        <header className="bg-bg-section border-b border-border sticky top-0 z-50">
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
                        {NAV_ITEMS.map((item) => (
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
                        {/* Search Button */}
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

                        {/* Notification Button */}
                        <button
                            type="button"
                            className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
                            aria-label="Thông báo"
                        >
                            <Bell size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                        </button>

                        {/* Profile Button */}
                        <Link
                            to="/profile"
                            className="p-2 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors"
                            aria-label="Tài khoản"
                        >
                            <User size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                        </Link>

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

            {/* Search Bar Panel - Hiển thị khi click vào icon search */}
            {isSearchOpen && (
                <div className="bg-bg-section border-t border-border px-4 py-3">
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
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-bg-section border-t border-border">
                    <div className="px-4 py-4 space-y-2">
                        {NAV_ITEMS.map((item) => (
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
        </header>
    );
};

export default Header;
