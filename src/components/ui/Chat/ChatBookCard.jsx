import React from 'react';
import { getBookCoverUrl, FALLBACK_IMAGES } from '@/utils/imageUrl';
import { BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatBookCard = ({ book, onClick }) => {
    if (!book) return null;

    const coverUrl = getBookCoverUrl(book.cover_url || book.image);
    const scorePercentage = book.score ? Math.round(book.score * 100) : null;

    // Check if category is object or string
    const categoryName = typeof book.category === 'object' ? book.category?.name : book.category;

    const handleClick = () => {
        if (book.isNotFound) {
            toast.error("Chi tiết sách không khả dụng");
            return;
        }
        onClick(book);
    };

    return (
        <div
            onClick={handleClick}
            className="flex flex-col bg-white rounded-lg border border-border hover:border-primary cursor-pointer transition-colors w-[120px] min-w-[120px] shrink-0 overflow-hidden shadow-sm hover:shadow-md snap-start"
        >
            {/* Cover Image */}
            <div className="aspect-[2/3] w-full bg-gray-100 relative overflow-hidden group">
                <img
                    src={coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGES.bookPlaceholder;
                    }}
                />

                {/* Score Badge */}
                {scorePercentage && (
                    <div className="absolute top-2 right-2 bg-yellow-500/90 text-white text-[9px] font-bold px-1 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                        {scorePercentage}%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-2 flex flex-col gap-1 flex-1">
                {/* Category Badge */}
                {categoryName && (
                    <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1 py-0.5 rounded w-fit max-w-full truncate">
                        {categoryName}
                    </span>
                )}

                {/* Title */}
                <h4 className="text-[10px] font-bold text-gray-800 line-clamp-2 leading-tight" title={book.title}>
                    {book.title}
                </h4>

                {/* Author */}
                <div className="mt-auto pt-1">
                    <p className="text-[9px] text-gray-500 truncate flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                        {Array.isArray(book.authors)
                            ? book.authors.map(a => a.name).join(', ')
                            : (typeof book.authors === 'string' ? book.authors : book.author || 'Unknown')}
                    </p>
                </div>

                {/* Status for Not Found */}
                {book.isNotFound && (
                    <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1 py-0.5 rounded mt-1 text-center border border-red-100">
                        Không có sẵn
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChatBookCard;
