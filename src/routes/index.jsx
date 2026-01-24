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
import LoginStaff from '../pages/auth/LoginStaff';
import Register from '../pages/auth/Register';

// Route Guards - Staff Login
import StaffLoginRoute from '../components/guards/StaffLoginRoute';

// Pages - Staff & Admin
import MainLayout from '../pages/staff/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Admin Pages
import Statistics from '../pages/admin/dashboard/Statistics';
import Inventory from '../pages/admin/dashboard/Inventory';
import InventoryLog from '../pages/admin/dashboard/InventoryLog';
import UserList from '../pages/admin/users/UserList';
import StaffList from '../pages/admin/staff/StaffList';
import AdminProfile from '../pages/admin/account/AdminProfile';
// ==========================================
// Router Configuration
// ==========================================
export const router = createBrowserRouter([
    // ==========================================
    // Protected User Routes (Authentication Required)
    // ==========================================

    // Homepage (User)
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Homepage />
            </ProtectedRoute>
        ),
    },
    // Book List with Pagination
    {
        path: '/books',
        element: (
            <ProtectedRoute>
                <BookList />
            </ProtectedRoute>
        ),
    },
    // Book Search
    {
        path: '/search',
        element: (
            <ProtectedRoute>
                <BookSearch />
            </ProtectedRoute>
        ),
    },
    // Categories Page
    {
        path: '/categories',
        element: (
            <ProtectedRoute>
                <CategoriesPage />
            </ProtectedRoute>
        ),
    },
    // Category Book List (Dynamic)
    {
        path: '/categories/:categoryId',
        element: (
            <ProtectedRoute>
                <CategoryBookList />
            </ProtectedRoute>
        ),
    },
    // Book Detail (Dynamic)
    {
        path: '/books/:bookId',
        element: (
            <ProtectedRoute>
                <BookDetail />
            </ProtectedRoute>
        ),
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
        children: [
            {
                index: true,
                element: <div />,
            },
            {
                path: 'statistics',
                element: <Statistics />,
            },
            {
                path: 'inventory',
                element: <Inventory />,
            },
            {
                path: 'inventory-log',
                element: <InventoryLog />,
            },
            {
                path: 'users',
                element: <UserList />,
            },
            {
                path: 'staff',
                element: <StaffList />,
            },
            {
                path: 'account',
                element: <AdminProfile />,
            },
        ],
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

    // ==========================================
    // Staff/Admin Login Route
    // ==========================================

    {
        path: '/login-staff',
        element: (
            <StaffLoginRoute>
                <LoginStaff />
            </StaffLoginRoute>
        ),
    },
]);