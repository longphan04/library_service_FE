// ==========================================
// Routes Configuration
// Mô tả: Cấu hình routing cho ứng dụng với route guards
// Vị trí: src/routes/index.jsx
// ==========================================

import { createBrowserRouter } from 'react-router-dom';

// Route Guards
import ProtectedRoute from '../componants/guards/ProtectedRoute';
import GuestRoute from '../componants/guards/GuestRoute';

// Pages
import Homepage from '../pages/user/Homepage';
import BookList from '../pages/user/BookList';
import BookSearch from '../pages/user/BookSearch';
import BorrowHistory from '../pages/user/BorrowHistory';
import CategoriesPage from '../pages/user/CategoriesPage';
import CategoryBookList from '../pages/user/CategoryBookList';
import BookDetail from '../pages/user/BookDetail';
import Bookshelf from '../pages/user/Bookshelf';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// ==========================================
// Router Configuration
// ==========================================
export const router = createBrowserRouter([
    // ==========================================
    // Public Routes (Guest ✅ | Authenticated ✅)
    // ==========================================

    // Homepage (User)
    {
        path: '/',
        element: <Homepage />,
    },
    // Book List with Pagination
    {
        path: '/books',
        element: <BookList />,
    },
    // Book Search
    {
        path: '/search',
        element: <BookSearch />,
    },
    // Categories Page
    {
        path: '/categories',
        element: <CategoriesPage />,
    },
    // Category Book List (Dynamic)
    {
        path: '/categories/:categoryId',
        element: <CategoryBookList />,
    },
    // Book Detail (Dynamic)
    {
        path: '/books/:bookId',
        element: <BookDetail />,
    },

    // ==========================================
    // Protected Routes (Guest ❌ → /login | Authenticated ✅)
    // ==========================================

    // Bookshelf - Kệ sách cá nhân
    {
        path: '/bookshelf',
        element: (
            <ProtectedRoute>
                <Bookshelf />
            </ProtectedRoute>
        ),
    },
    // Borrow History - Lịch sử mượn sách
    {
        path: '/borrow-history',
        element: (
            <ProtectedRoute>
                <BorrowHistory />
            </ProtectedRoute>
        ),
    },

    // ==========================================
    // Guest Routes (Guest ✅ | Authenticated ❌ → /)
    // ==========================================

    // Login
    {
        path: '/login',
        element: (
            <GuestRoute>
                <Login />
            </GuestRoute>
        ),
    },
    // Register
    {
        path: '/register',
        element: (
            <GuestRoute>
                <Register />
            </GuestRoute>
        ),
    },
]);
