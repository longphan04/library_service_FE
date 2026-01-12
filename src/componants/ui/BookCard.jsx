// ==========================================
// Component: BookCard
// Mô tả: Component hiển thị thông tin sách dạng card
// Vị trí: src/components/ui/BookCard.jsx
// ==========================================

import { Link, useNavigate } from 'react-router-dom';

// ==========================================
// Props:
// - id: string - ID của sách (để điều hướng)
// - coverImage: string - URL ảnh bìa sách
// - title: string - Tên sách
// - author: string - Tên tác giả
// - onBorrow: function - Handler khi click nút mượn sách (optional, deprecated - dùng navigation)
// - className: string - Class tùy chỉnh thêm
// ==========================================

const BookCard = ({
    id,
    coverImage,
    title,
    author,
    onBorrow,
    className = '',
}) => {
    const navigate = useNavigate();

    const handleBorrowClick = (e) => {
        e.preventDefault(); // Ngăn navigation khi click nút
        // Điều hướng đến trang chi tiết sách
        navigate(`/books/${id}`);
    };

    return (
        <div
            className={`group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
        >
            {/* Book Cover - Clickable */}
            <Link to={`/books/${id}`} className="block">
                <div className="relative overflow-hidden">
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full aspect-3/4 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </Link>

            {/* Book Info */}
            <div className="p-3 space-y-2">
                <Link to={`/books/${id}`}>
                    <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </Link>
                <p className="text-xs text-text-sub line-clamp-1">
                    {author}
                </p>

                {/* Borrow Button */}
                <button
                    onClick={handleBorrowClick}
                    className="w-full py-1.5 px-3 bg-primary text-text-on-primary text-xs font-semibold rounded hover:bg-primary-hover transition-colors"
                >
                    MƯỢN SÁCH
                </button>
            </div>
        </div>
    );
};

export default BookCard;
