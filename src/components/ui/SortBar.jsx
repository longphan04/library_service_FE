// ==========================================
// Component: SortBar
// Mô tả: Thanh sắp xếp với sort buttons và toggle grid/list
// Vị trí: src/components/ui/SortBar.jsx
// ==========================================

import { Grid3X3, List } from 'lucide-react';

// ==========================================
// Props:
// - sortBy: string - Giá trị sort hiện tại ('newest' | 'popular')
// - onSortChange: function - Callback khi đổi sort
// - viewMode: string - Chế độ hiển thị ('grid' | 'list')
// - onViewModeChange: function - Callback khi đổi chế độ hiển thị
// - className: string - Class tùy chỉnh
// ==========================================

const SORT_OPTIONS = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến nhất' },
];

const SortBar = ({
    sortBy = 'newest',
    onSortChange,
    viewMode = 'grid',
    onViewModeChange,
    showViewToggle = true,
    className = '',
}) => {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {/* Sort Buttons */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-text-sub mr-2">Sắp xếp:</span>
                <div className="flex bg-bg-section rounded-lg p-1 gap-1">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSortChange?.(option.value)}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-md
                                transition-all duration-200
                                ${sortBy === option.value
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-primary hover:bg-bg-card-hover'
                                }
                            `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* View Mode Toggle - Conditional */}
            {showViewToggle && (
                <div className="flex items-center gap-1 bg-bg-section rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => onViewModeChange?.('grid')}
                        className={`
                            p-2 rounded-md transition-all duration-200
                            ${viewMode === 'grid'
                                ? 'bg-primary text-white'
                                : 'text-text-sub hover:text-text-primary hover:bg-bg-card-hover'
                            }
                        `}
                        aria-label="Chế độ lưới"
                    >
                        <Grid3X3 size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onViewModeChange?.('list')}
                        className={`
                            p-2 rounded-md transition-all duration-200
                            ${viewMode === 'list'
                                ? 'bg-primary text-white'
                                : 'text-text-sub hover:text-text-primary hover:bg-bg-card-hover'
                            }
                        `}
                        aria-label="Chế độ danh sách"
                    >
                        <List size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SortBar;
