// ==========================================
// Routes Configuration
// Mô tả: Cấu hình routing cho ứng dụng với route guards và providers lồng vào router
// Vị trí: src/routes/index.jsx
// ==========================================

import { createBrowserRouter, Outlet } from 'react-router-dom';

// Providers
import { AuthProvider } from '@/contexts/AuthContext';
import { BookDetailProvider } from '@/contexts/BookDetailContext';
import { Toaster } from 'react-hot-toast';

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
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

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

// Utilities
import ScrollToTop from '../components/utils/ScrollToTop';

import { PrefetchProvider } from '@/contexts/PrefetchContext';

/**
 * Root Component - Bao bọc toàn bộ ứng dụng trong các context cần thiết.
 * Việc đặt Provider bên trong cấu trúc Router giúp giải quyết triệt để các lỗi runtime
 * liên quan đến việc hook được sử dụng bên ngoài provider khi định tuyến thay đổi.
 */
const Root = () => (
    <PrefetchProvider>
        <AuthProvider>
            <BookDetailProvider>
                <ScrollToTop />
                <Outlet />
                <Toaster position="top-right" reverseOrder={false} />
            </BookDetailProvider>
        </AuthProvider>
    </PrefetchProvider>
);

// ==========================================
// Router Configuration
// ==========================================
export const router = createBrowserRouter([
    {
        element: <Root />,
        children: [
            // ==========================================
            // Protected User Routes (Yêu cầu đăng nhập)
            // ==========================================

            // Homepage (Public)
            {
                path: '/',
                element: <Homepage />,
            },
            // Danh sách sách (Public - Read only)
            {
                path: '/books',
                element: <BookList />,
            },
            // Tìm kiếm sách (Public)
            {
                path: '/search',
                element: <BookSearch />,
            },
            // Trang danh mục (Public)
            {
                path: '/categories',
                element: <CategoriesPage />,
            },
            // Danh sách sách theo danh mục (Public)
            {
                path: '/categories/:categoryId',
                element: <CategoryBookList />,
            },
            // Chi tiết sách (Public)
            {
                path: '/books/:bookId',
                element: <BookDetail />,
            },

            // ==========================================
            // MEMBER Routes (Dành cho Member)
            // ==========================================

            // User Dashboard - Member chuyển hướng đến đây sau khi login
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
            // STAFF Routes (Dành cho Nhân viên)
            // ==========================================

            {
                path: '/staff',
                element: (
                    <RoleRoute allowedRoles={[ROLES.STAFF]}>
                        <MainLayout />
                    </RoleRoute>
                ),
            },
            // Staff catch-all cho các route lồng nhau trong tương lai
            {
                path: '/staff/*',
                element: (
                    <RoleRoute allowedRoles={[ROLES.STAFF]}>
                        <MainLayout />
                    </RoleRoute>
                ),
            },

            // ==========================================
            // ADMIN Routes (Dành cho Quản trị viên)
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
            // Guest Routes (Khách ✅ | Đã đăng nhập ❌ → chuyển hướng theo Role)
            // ==========================================

            // Đăng nhập người dùng
            {
                path: '/login',
                element: (
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                ),
            },
            // Đăng ký người dùng
            {
                path: '/register',
                element: (
                    <GuestRoute>
                        <Register />
                    </GuestRoute>
                ),
            },
            // Quên mật khẩu
            {
                path: '/forgot-password',
                element: (
                    <GuestRoute>
                        <ForgotPassword />
                    </GuestRoute>
                ),
            },
            // Đặt lại mật khẩu (với token từ email)
            {
                path: '/reset-password',
                element: (
                    <GuestRoute>
                        <ResetPassword />
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
        ]
    }
]);