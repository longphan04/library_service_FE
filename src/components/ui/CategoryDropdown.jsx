// ==========================================
// Component: CategoryDropdown
// Mô tả: Dropdown chọn danh mục sách
// Vị trí: src/componants/ui/CategoryDropdown.jsx
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Grid2X2 } from 'lucide-react';

// ==========================================
// Props:
// - value: string - Giá trị category đang chọn (id)
// - onChange: function - Callback khi đổi category
// - categories: array - Danh sách categories [{id, name}]
// - className: string - Class tùy chỉnh
// ==========================================

const CategoryDropdown = ({
    value = '',
    onChange,
    categories = [],
    loading = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Tìm category đang chọn - Convert IDs to string for safe comparison
    const selectedCategory = categories.find(cat => String(cat.id) === String(value));

    // DEBUG: Log category matching
    console.log('[CategoryDropdown] Props:', { value, categoriesCount: categories.length, loading });
    console.log('[CategoryDropdown] Selected category:', selectedCategory);

    // Determine display text
    let displayText = 'Tất cả danh mục';
    if (loading) {
        displayText = 'Đang tải...';
    } else if (selectedCategory) {
        displayText = selectedCategory.name;
    }

    const handleSelect = (categoryId) => {
        // DEBUG: Log selection
        console.log('[CategoryDropdown] handleSelect called with:', categoryId, typeof categoryId);
        onChange?.(categoryId);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !loading && setIsOpen(!isOpen)}
                disabled={loading}
                className={`
                    flex items-center justify-between gap-3
                    px-4 py-2.5
                    bg-bg-section border border-border rounded-lg
                    text-text-primary
                    hover:bg-bg-card-hover hover:border-primary/30
                    transition-all duration-200
                    min-w-[180px]
                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
            >
                <div className="flex items-center gap-2">
                    <Grid2X2 size={18} className="text-primary" />
                    <span className="text-sm font-medium truncate">
                        {displayText}
                    </span>
                </div>
                <ChevronDown
                    size={18}
                    className={`text-text-sub transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && !loading && (
                <div className="absolute z-50 mt-2 w-full min-w-[200px] max-h-64 overflow-y-auto bg-bg-section border border-border rounded-lg shadow-lg">
                    {/* Option: Tất cả danh mục */}
                    <button
                        type="button"
                        onClick={() => handleSelect('')}
                        className={`
                            w-full px-4 py-2.5 text-left text-sm
                            hover:bg-bg-card-hover
                            transition-colors duration-150
                            ${!value ? 'bg-primary/10 text-primary font-medium' : 'text-text-primary'}
                        `}
                    >
                        Tất cả danh mục
                    </button>

                    {/* Divider */}
                    <div className="border-t border-border my-1" />

                    {/* Category Options */}
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => handleSelect(category.id)}
                            className={`
                                w-full px-4 py-2.5 text-left text-sm
                                hover:bg-bg-card-hover
                                transition-colors duration-150
                                ${String(category.id) === String(value)
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-text-primary'
                                }
                            `}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
