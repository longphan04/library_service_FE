// ==========================================
// Component: BookCard
// Mô tả: Component hiển thị thông tin sách dạng card
// Performance: React.memo, optimized image handling
// Vị trí: src/components/ui/BookCard.jsx
// ==========================================

import { useState, useEffect, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FALLBACK_IMAGES } from '../../utils/imageUrl';

// ==========================================
// Constants
// ==========================================

const FALLBACK_IMAGE = FALLBACK_IMAGES.bookPlaceholder;

// ==========================================
// BookCard Component
// ==========================================

/**
 * Props:
 * @param {string|number} id - ID của sách
 * @param {string} coverImage - URL ảnh bìa sách
 * @param {string} title - Tên sách
 * @param {string} author - Tên tác giả
 * @param {number} availableCopies - Số cuốn còn lại (từ API)
 * @param {boolean} showAvailability - Hiển thị số lượng còn lại
 * @param {string} className - Class tùy chỉnh thêm
 * @param {function} onClick - Hàm xử lý khi click vào card (nếu có sẽ không dùng Link)
 */
const BookCard = memo(function BookCard({
    id,
    coverImage,
    title = 'Không rõ',
    author = 'Không rõ',
    availableCopies,
    showAvailability = false,
    className = '',
    onClick,
}) {
    // ==========================================
    // Image State
    // ==========================================

    const [imgSrc, setImgSrc] = useState(() => coverImage || FALLBACK_IMAGE);
    const [hasError, setHasError] = useState(false);

    // Sync image source when prop changes
    useEffect(() => {
        if (coverImage && coverImage !== imgSrc && !hasError) {
            setImgSrc(coverImage);
            setHasError(false);
        } else if (!coverImage && imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
        }
    }, [coverImage]);

    // Handle image error - use useCallback for stability
    const handleImageError = useCallback(() => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(FALLBACK_IMAGE);
        }
    }, [hasError]);

    // ==========================================
    // Derived Values
    // ==========================================

    const bookUrl = `/books/${id}`;
    const isAvailable = availableCopies > 0;

    // ==========================================
    // Handlers
    // ==========================================
    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick(id);
        }
    };

    // ==========================================
    // Render
    // ==========================================

    const CardContent = () => (
        <>
            {/* Book Cover - Fixed Aspect Ratio Container */}
            <div className="relative overflow-hidden bg-gray-100 aspect-3/4 w-full">
                <img
                    src={imgSrc}
                    alt={`Bìa sách: ${title}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError}
                    loading="lazy"
                    decoding="async"
                />
            </div>

            {/* Book Info */}
            <div className="p-3 space-y-1">
                {/* Title */}
                <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Author */}
                <p className="text-xs text-text-sub line-clamp-1">
                    {author}
                </p>

                {/* Available Copies */}
                {showAvailability && typeof availableCopies === 'number' && (
                    <p className={`text-xs font-medium ${isAvailable ? 'text-success' : 'text-error'}`}>
                        {isAvailable ? `Còn ${availableCopies} cuốn` : 'Hết sách'}
                    </p>
                )}
            </div>
        </>
    );

    return (
        <article
            className={`group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
        >
            {onClick ? (
                <div
                    onClick={handleClick}
                    className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                    role="button"
                    tabIndex={0}
                    aria-label={`Xem chi tiết sách: ${title}`}
                >
                    <CardContent />
                </div>
            ) : (
                <Link
                    to={bookUrl}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                    aria-label={`Xem chi tiết sách: ${title}`}
                >
                    <CardContent />
                </Link>
            )}
        </article>
    );
});

export default BookCard;
