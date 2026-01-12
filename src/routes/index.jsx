// ==========================================
// Routes Configuration
// Mô tả: Cấu hình routing cho ứng dụng
// Vị trí: src/routes/index.jsx
// ==========================================

import { createBrowserRouter } from 'react-router-dom';

// Pages
import Homepage from '../pages/user/Homepage';
import BookList from '../pages/user/BookList';
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
    // Bookshelf
    {
        path: '/bookshelf',
        element: <Bookshelf />,
    },
    // Auth Routes
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
]);
