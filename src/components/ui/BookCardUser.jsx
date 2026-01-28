import { useState, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookDetail } from '@/contexts/BookDetailContext';
import { FALLBACK_IMAGES, getBookCoverUrl } from '@/utils/imageUrl';

// ==========================================
// Hằng số (Constants)
// ==========================================

const FALLBACK_IMAGE = FALLBACK_IMAGES.bookPlaceholder;

// ==========================================
// Component: BookCard
// Mô tả: Card hiển thị thông tin rút gọn của sách
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
 * @param {function} onClick - Hàm xử lý khi click vào card. Nếu được cung cấp, nó sẽ ghi đè hành động mở Modal mặc định.
 * @param {React.ReactNode} children - Các component bổ sung (ví dụ: CountdownTimer)
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
    children, // Nhận children prop
}) {
    // ==========================================
    // Context & Hooks
    // ==========================================
    const { openBookDetail } = useBookDetail();
    const navigate = useNavigate();

    // ==========================================
    // Trạng thái hình ảnh (Image State)
    // ==========================================

    // Sử dụng getBookCoverUrl để đảm bảo URL luôn đúng format (prefix /public/book/ nếu cần)
    const validCoverUrl = getBookCoverUrl(coverImage);
    const [imgSrc, setImgSrc] = useState(() => validCoverUrl);
    const [hasError, setHasError] = useState(false);

    // Đồng bộ nguồn ảnh khi prop thay đổi
    useEffect(() => {
        const newUrl = getBookCoverUrl(coverImage);
        if (newUrl && newUrl !== imgSrc && !hasError) {
            setImgSrc(newUrl);
            setHasError(false);
        } else if (!newUrl && imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
        }
    }, [coverImage]);

    // Xử lý lỗi khi tải ảnh - sử dụng useCallback để đảm bảo tính ổn định
    const handleImageError = useCallback(() => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(FALLBACK_IMAGE);
        }
    }, [hasError]);

    // ==========================================
    // Giá trị phái sinh (Derived Values)
    // ==========================================

    const isAvailable = availableCopies > 0;

    // ==========================================
    // Các hàm xử lý (Handlers)
    // ==========================================
    const handleCardClick = (e) => {
        // Nếu có hàm onClick tùy chọn (từ Chatbot/Hero), ưu tiên thực hiện
        if (onClick) {
            e.preventDefault();
            e.stopPropagation();
            onClick(id);
        } else {
            // Navigate to detail page
            navigate(`/books/${id}`);
        }
    };

    // ==========================================
    // Component hiển thị nội dung bên trong card
    // ==========================================

    const CardContent = () => (
        <>
            {/* Ảnh bìa sách - Container với tỉ lệ khung hình cố định */}
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

            {/* Thông tin sách - Đảm bảo layout không vỡ với space-y-1 */}
            <div className="p-3 space-y-1">
                {/* Tiêu đề */}
                <h3 className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Tác giả */}
                <p className="text-xs text-text-sub line-clamp-1">
                    {author}
                </p>

                {/* Số lượng còn lại */}
                {showAvailability && typeof availableCopies === 'number' && (
                    <p className={`text-xs font-medium ${isAvailable ? 'text-success' : 'text-error'}`}>
                        {isAvailable ? `Còn ${availableCopies} cuốn` : 'Hết sách'}
                    </p>
                )}

                {/* RENDER CHILDREN: Vị trí ngay dưới phần hiển thị trạng thái */}
                {children}
            </div>
        </>
    );

    return (
        <article
            className={`group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
        >
            <div
                onClick={handleCardClick}
                className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg h-full"
                role="button"
                tabIndex={0}
                aria-label={`Xem chi tiết sách: ${title}`}
            >
                <CardContent />
            </div>
        </article>
    );
});

export default BookCard;
