import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './styles/tailwind.css';

/**
 * Entry Point của ứng dụng.
 * Lưu ý: Các Providers (Auth, BookDetail) đã được tích hợp trực tiếp vào trong 
 * cấu trúc của Router (xem src/routes/index.jsx) để đảm bảo tính nhất quán 
 * và giải quyết triệt để các lỗi liên quan đến Context.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
