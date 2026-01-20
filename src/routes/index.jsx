// ==========================================
// Routes Configuration
// Mô tả: Cấu hình routing cho ứng dụng với route guards
// Vị trí: src/routes/index.jsx
// ==========================================

import { createBrowserRouter } from 'react-router-dom';

// Route Guards
import ProtectedRoute from '../components/guards/ProtectedRoute';
import GuestRoute from '../components/guards/GuestRoute';
import RoleRoute from '../components/guards/RoleRoute';

// Role Constants
import { ROLES } from '../constants/roles';

// Pages - User
import Homepage from '../pages/user/Homepage';
import BookList from '../pages/user/BookList';
import BookSearch from '../pages/user/BookSearch';
import BorrowHistory from '../pages/user/BorrowHistory';
import CategoriesPage from '../pages/user/CategoriesPage';
import CategoryBookList from '../pages/user/CategoryBookList';
import BookDetail from '../pages/user/BookDetail';
import Bookshelf from '../pages/user/Bookshelf';

// Pages - Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Pages - Staff & Admin
import MainLayout from '../pages/staff/MainLayout';
import AdminLayout from '../components/layouts/AdminLayout';

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
    // MEMBER Routes (Role: MEMBER)
    // ==========================================

    // User Dashboard - MEMBER redirect destination after login
    {
        path: '/user',
        element: (
            <RoleRoute allowedRoles={[ROLES.MEMBER]}>
                <Homepage />
            </RoleRoute>
        ),
    },
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
    // STAFF Routes (Role: STAFF)
    // ==========================================

    {
        path: '/staff',
        element: (
            <RoleRoute allowedRoles={[ROLES.STAFF]}>
                <MainLayout />
            </RoleRoute>
        ),
    },
    // Staff catch-all for future nested routes
    {
        path: '/staff/*',
        element: (
            <RoleRoute allowedRoles={[ROLES.STAFF]}>
                <MainLayout />
            </RoleRoute>
        ),
    },

    // ==========================================
    // ADMIN Routes (Role: ADMIN)
    // ==========================================

    {
        path: '/admin',
        element: (
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout />
            </RoleRoute>
        ),
    },
    // Admin catch-all for future nested routes
    {
        path: '/admin/*',
        element: (
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout />
            </RoleRoute>
        ),
    },

    // ==========================================
    // Guest Routes (Guest ✅ | Authenticated ❌ → redirect by role)
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

