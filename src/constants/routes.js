// ==========================================
// Route Constants
// Mô tả: Định nghĩa tất cả route paths và phân loại routes
// Vị trí: src/constants/routes.js
// ==========================================

/**
 * All route paths
 */
export const ROUTES = {
    // Public routes
    HOME: '/',
    CATEGORIES: '/categories',
    CATEGORY_DETAIL: '/categories/:categoryId',
    BOOKS: '/books',
    BOOK_DETAIL: '/books/:bookId',
    SEARCH: '/search',

    // Protected routes (requires authentication)
    BOOKSHELF: '/bookshelf',
    BORROW_HISTORY: '/borrow-history',

    // Guest routes (guest only)
    LOGIN: '/login',
    REGISTER: '/register',
};

/**
 * Protected routes - Chỉ dành cho user đã đăng nhập
 */
export const PROTECTED_ROUTES = [
    ROUTES.BOOKSHELF,
    ROUTES.BORROW_HISTORY,
];

/**
 * Guest routes - Chỉ dành cho user chưa đăng nhập
 */
export const GUEST_ROUTES = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
];

/**
 * Public routes - Ai cũng truy cập được
 */
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.CATEGORIES,
    ROUTES.CATEGORY_DETAIL,
    ROUTES.BOOKS,
    ROUTES.BOOK_DETAIL,
    ROUTES.SEARCH,
];
