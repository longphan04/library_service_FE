import React from 'react';

/**
 * BookCard Component - Hiển thị thông tin sách với Tailwind CSS
 * @param {string} id - ID sách
 * @param {string} title - Tên sách
 * @param {string} author - Tên tác giả
 * @param {string} coverImage - URL ảnh bìa
 * @param {function} onClick - Hàm xử lý khi click
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const BookCard = ({
    id,
    title,
    author,
    coverImage,
    onClick,
    size = 'md',
    className = '',
    ...props
}) => {
    // Size styles cho cover image
    const coverSizeStyles = {
        sm: 'w-24 h-36',
        md: 'w-32 h-48',
        lg: 'w-40 h-60'
    };

    // Size styles cho text
    const titleSizeStyles = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const handleClick = () => {
        onClick?.(id);
    };

    return (
        <div
            className={`
        flex flex-col gap-2 cursor-pointer group
        transition-all duration-200
        ${className}
      `}
            onClick={handleClick}
            {...props}
        >
            {/* Book Cover */}
            <div className={`
        ${coverSizeStyles[size]}
        rounded-lg overflow-hidden
        bg-bg-card-hover
        shadow-md
        group-hover:shadow-lg
        group-hover:scale-105
        transition-all duration-200
      `}>
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                        <svg
                            className="w-10 h-10 text-icon"
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
                    </div>
                )}
            </div>

            {/* Book Info */}
            <div className="flex flex-col gap-0.5">
                <h3 className={`
          ${titleSizeStyles[size]}
          font-medium text-text-primary
          line-clamp-2
          group-hover:text-primary
          transition-colors duration-200
        `}>
                    {title}
                </h3>
                {author && (
                    <p className="text-sm text-text-sub line-clamp-1">
                        {author}
                    </p>
                )}
            </div>
        </div>
    );
};

export default BookCard;
