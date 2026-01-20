import React from 'react';

/**
 * CategoryCard Component - Hiển thị thể loại sách với Tailwind CSS
 * @param {string} id - ID thể loại
 * @param {string} name - Tên thể loại
 * @param {number} bookCount - Số lượng sách
 * @param {ReactNode} icon - Icon của thể loại
 * @param {function} onClick - Hàm xử lý khi click
 * @param {boolean} selected - Trạng thái được chọn
 */
const CategoryCard = ({
    id,
    name,
    bookCount,
    icon,
    onClick,
    selected = false,
    className = '',
    ...props
}) => {
    const handleClick = () => {
        onClick?.(id);
    };

    // Default book icon
    const defaultIcon = (
        <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
        </svg>
    );

    return (
        <button
            className={`
        flex flex-col items-center justify-center gap-3
        p-6 min-w-[140px] min-h-[140px]
        bg-white rounded-xl
        border border-[#C4A77D] 
        shadow-[0_2px_8px_rgba(122,74,46,0.12)]
        transition-all duration-200
        cursor-pointer
        hover:shadow-[0_4px_12px_rgba(122,74,46,0.18)]
        hover:border-primary
        hover:bg-[#FFFBF7]
        ${selected
                    ? 'border-primary shadow-[0_4px_12px_rgba(122,74,46,0.18)] bg-[#FFFBF7]'
                    : ''
                }
        ${className}
      `}
            onClick={handleClick}
            {...props}
        >
            {/* Icon */}
            <div className={`
        flex items-center justify-center
        w-12 h-12 rounded-lg
        ${selected ? 'text-primary' : 'text-icon'}
        transition-colors duration-200
      `}>
                {icon || defaultIcon}
            </div>

            {/* Category Name */}
            <h3 className={`
        text-base font-semibold text-center
        ${selected ? 'text-primary' : 'text-text-primary'}
        transition-colors duration-200
      `}>
                {name}
            </h3>

            {/* Book Count */}
            {bookCount !== undefined && (
                <p className="text-sm text-text-sub font-medium">
                    {bookCount} cuốn sách
                </p>
            )}
        </button>
    );
};

export default CategoryCard;
