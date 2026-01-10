import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BookSection Component - Section hiển thị danh sách sách với tiêu đề và link "Xem tất cả"
 * @param {string} title - Tiêu đề section (VD: "Hot list", "Trinh Thám")
 * @param {string} viewAllLink - Link đến trang xem tất cả
 * @param {string} viewAllText - Text của link xem tất cả
 * @param {ReactNode} children - Nội dung bên trong (BookCards)
 */
const BookSection = ({
    title,
    viewAllLink,
    viewAllText = 'Xem tất cả',
    children,
    className = '',
    ...props
}) => {
    return (
        <section className={`py-6 ${className}`} {...props}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                    {title}
                </h2>
                {viewAllLink && (
                    <Link
                        to={viewAllLink}
                        className="
              flex items-center gap-1
              text-primary font-medium
              hover:text-primary-hover
              transition-colors duration-200
            "
                    >
                        <span>{viewAllText}</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                )}
            </div>

            {/* Section Content */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {children}
            </div>
        </section>
    );
};

export default BookSection;
