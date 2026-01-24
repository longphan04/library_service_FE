// ==========================================
// Context: BookDetailContext
// Mô tả: Quản lý trạng thái hiển thị modal chi tiết sách toàn cục
// Vị trí: src/contexts/BookDetailContext.jsx
// ==========================================

import { createContext, useContext, useState, useCallback } from 'react';
import BookDetailModal from '../components/ui/BookDetailModal';

const BookDetailContext = createContext(null);

export const BookDetailProvider = ({ children }) => {
    // Trạng thái mở/đóng của modal
    const [isOpen, setIsOpen] = useState(false);
    // ID của cuốn sách đang được chọn để xem chi tiết
    const [selectedBookId, setSelectedBookId] = useState(null);

    // Hàm mở modal chi tiết sách
    const openBookDetail = useCallback((bookId) => {
        if (!bookId) return;
        setSelectedBookId(bookId);
        setIsOpen(true);
    }, []);

    // Hàm đóng modal
    const closeBookDetail = useCallback(() => {
        setIsOpen(false);
    }, []);

    const value = {
        isOpen,
        selectedBookId,
        openBookDetail,
        closeBookDetail,
    };

    return (
        <BookDetailContext.Provider value={value}>
            {children}
            {/* Instance của Modal hiển thị toàn hệ thống */}
            <BookDetailModal
                isOpen={isOpen}
                onClose={closeBookDetail}
                bookId={selectedBookId}
            />
        </BookDetailContext.Provider>
    );
};

// Hook tùy chỉnh để sử dụng context một cách thuận tiện
export const useBookDetail = () => {
    const context = useContext(BookDetailContext);
    if (!context) {
        throw new Error('useBookDetail phải được sử dụng trong BookDetailProvider');
    }
    return context;
};
