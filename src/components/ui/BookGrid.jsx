// ==========================================
// Component: BookGrid
// Mô tả: Component hiển thị danh sách sách dạng lưới (grid) hoặc danh sách (list)
// Vị trí: src/components/ui/BookGrid.jsx
// ==========================================

import { useBookDetail } from '@/contexts/BookDetailContext';
import BookCard from './BookCardUser';
import Skeleton from './Skeleton';

// ==========================================
// Các thuộc tính (Props):
// - books: array - Danh sách sách
// - viewMode: string - Chế độ hiển thị 'grid' | 'list'
// - isLoading: boolean - Trạng thái đang tải
// - className: string - Các class CSS tùy chỉnh
// - onBookClick: function - Hàm xử lý khi click vào sách (tùy chọn)
// ==========================================

const BookGrid = ({
    books = [],
    viewMode = 'grid',
    isLoading = false,
    className = '',
    onBookClick,
}) => {
    // ==========================================
    // Context
    // ==========================================
    const { openBookDetail } = useBookDetail();

    // Hiển thị khung xương khi đang tải (Loading Skeleton)
    if (isLoading) {
        return (
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 ${className}`}>
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <Skeleton className="aspect-3/4" />
                        <div className="p-3 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Chế độ hiển thị dạng Lưới (Grid View)
    if (viewMode === 'grid') {
        return (
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 ${className}`}>
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        id={book.id || book.book_id || book._id}
                        title={book.title}
                        author={book.author}
                        coverImage={book.coverImage}
                        onClick={onBookClick}
                    />
                ))}
            </div>
        );
    }

    // Chế độ hiển thị dạng Danh sách (List View)
    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {books.map((book) => {
                const bookId = book.id || book.book_id || book._id;
                const handleClick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Gọi prop onClick nếu có
                    if (onBookClick) {
                        onBookClick(bookId);
                    }

                    // Mở modal chi tiết sách nếu ID hợp lệ
                    if (bookId && !String(bookId).includes('placeholder')) {
                        openBookDetail(bookId);
                    }
                };

                return (
                    <div
                        key={bookId}
                        onClick={handleClick}
                        className="group flex gap-4 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleClick(e);
                            }
                        }}
                    >
                        {/* Ảnh bìa sách */}
                        <div className="shrink-0 w-24 sm:w-32">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full aspect-3/4 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* Thông tin sách */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-sm text-text-sub mt-1">
                                {book.author}
                            </p>
                            {book.description && (
                                <p className="text-sm text-text-sub mt-2 line-clamp-2">
                                    {book.description}
                                </p>
                            )}
                            {book.category && (
                                <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                                    {book.category}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BookGrid;
