import React, { useState } from 'react';

const ExpandableText = ({ content, maxLength = 420, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!content || content.length <= maxLength) {
        return (
            <p className={`text-sm text-text-sub leading-relaxed text-justify whitespace-pre-line ${className}`}>
                {content}
            </p>
        );
    }


    return (
        <div className={className}>
            <div className="relative">
                <p className={`text-sm text-text-sub leading-relaxed text-justify whitespace-pre-line transition-all duration-300 ${isExpanded ? '' : 'line-clamp-4'}`}>
                    {content}
                </p>

                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-bg-section to-transparent pointer-events-none" />
                )}
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors focus:outline-none cursor-pointer"
            >
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
        </div>
    );
};

export default ExpandableText;
