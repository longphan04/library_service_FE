

/**
 * CategoryCard Component - Hiển thị thể loại sách với Tailwind CSS
 * @param {string} id - ID thể loại
 * @param {string} name - Tên thể loại
 * @param {number} bookCount - Số lượng sách
 * @param {ReactNode} icon - Icon của thể loại
 * @param {function} onClick - Hàm xử lý khi click
 * @param {boolean} selected - Trạng thái được chọn
 */
import React from 'react';
import { getCategoryImageUrl, FALLBACK_IMAGES } from '@/utils/imageUrl';

/**
 * CategoryCard Component - Hiển thị thể loại sách với hình ảnh background
 * Design giống HotCategorySection trên Homepage
 * 
 * @param {string} id - ID thể loại
 * @param {string} name - Tên thể loại
 * @param {number} bookCount - Số lượng sách
 * @param {string} image - URL ảnh của thể loại
 * @param {function} onClick - Hàm xử lý khi click
 * @param {boolean} selected - Trạng thái được chọn
 */
const CategoryCard = ({
    id,
    name,
    bookCount,
    image,
    onClick,
    selected = false,
    className = '',
    ...props
}) => {
    const handleClick = () => {
        onClick?.(id);
    };

    // Chuẩn hóa URL ảnh
    const imageUrl = getCategoryImageUrl(image);

    return (
        <button
            onClick={handleClick}
            className={`
                relative group overflow-hidden rounded-xl w-full aspect-3/2
                transition-all duration-300
                ${selected
                    ? 'ring-4 ring-primary shadow-lg scale-[1.02]'
                    : 'hover:shadow-md hover:scale-[1.01]'
                }
                ${className}
            `}
            {...props}
        >
            {/* Ảnh category */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGES.categoryPlaceholder;
                    }}
                />
            </div>

            {/* Overlay gradient */}
            <div className={`
                absolute inset-0 bg-linear-to-t 
                ${selected
                    ? 'from-primary/90 via-primary/40 to-transparent'
                    : 'from-black/80 via-black/30 to-transparent'
                }
                transition-colors duration-300
            `} />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left">
                <h3 className="text-white font-semibold text-base sm:text-lg truncate shadow-black/50 drop-shadow-sm">
                    {name}
                </h3>
                {bookCount !== undefined && (
                    <p className="text-white/90 text-xs sm:text-sm font-medium mt-0.5">
                        {bookCount} cuốn sách
                    </p>
                )}
            </div>
        </button>
    );
};

export default CategoryCard;
