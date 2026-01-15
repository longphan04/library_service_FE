// ==========================================
// Hook: useBorrowedBooks
// Mô tả: Custom hook quản lý sách đã mượn qua LocalStorage
// Vị trí: src/hooks/useBorrowedBooks.js
// ==========================================

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'borrowedBooks';

/**
 * Custom hook để quản lý sách đã mượn
 * Sử dụng LocalStorage để persist data
 */
const useBorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    // Load từ LocalStorage khi mount
    useEffect(() => {
        const loadBorrowedBooks = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const books = JSON.parse(stored);
                    setBorrowedBooks(books);
                }
            } catch (error) {
                console.error('Error loading borrowed books:', error);
            }
        };

        loadBorrowedBooks();
    }, []);

    // Lưu vào LocalStorage mỗi khi borrowedBooks thay đổi
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(borrowedBooks));
        } catch (error) {
            console.error('Error saving borrowed books:', error);
        }
    }, [borrowedBooks]);

    /**
     * Thêm sách vào danh sách đã mượn
     * @param {Object} book - Thông tin sách
     */
    const addBorrowedBook = (book) => {
        // Kiểm tra xem sách đã tồn tại chưa
        const exists = borrowedBooks.some((b) => b.id === book.id);

        if (exists) {
            throw new Error('Sách này đã có trong kệ sách của bạn');
        }

        const newBook = {
            ...book,
            addedAt: new Date().toISOString(),
        };

        setBorrowedBooks((prev) => [newBook, ...prev]);
    };

    /**
     * Xóa sách khỏi danh sách đã mượn
     * @param {string} bookId - ID của sách cần xóa
     */
    const removeBorrowedBook = (bookId) => {
        setBorrowedBooks((prev) => prev.filter((book) => book.id !== bookId));
    };

    /**
     * Xóa tất cả sách đã mượn
     */
    const clearAllBooks = () => {
        if (window.confirm('Bạn có chắc muốn xóa tất cả sách đã mượn?')) {
            setBorrowedBooks([]);
        }
    };

    /**
     * Kiểm tra xem sách đã được mượn chưa
     * @param {string} bookId - ID của sách
     * @returns {boolean}
     */
    const isBookBorrowed = (bookId) => {
        return borrowedBooks.some((book) => book.id === bookId);
    };

    return {
        borrowedBooks,
        addBorrowedBook,
        removeBorrowedBook,
        clearAllBooks,
        isBookBorrowed,
    };
};

export default useBorrowedBooks;
