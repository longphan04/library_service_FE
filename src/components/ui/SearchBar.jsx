// ==========================================
// Component: SearchBar
// Mô tả: Thanh tìm kiếm với icon search và nút đóng
// Vị trí: src/components/ui/SearchBar.jsx
// ==========================================

import { useState } from 'react';
import { Search, X } from 'lucide-react';

// ==========================================
// Props:
// - placeholder: string - Placeholder text (default: "Tìm kiếm theo tên sách hoặc tác giả...")
// - value: string - Giá trị input (controlled)
// - onChange: function - Callback khi giá trị thay đổi
// - onSearch: function - Callback khi submit search
// - onClose: function - Callback khi bấm nút X để tắt/đóng search
// - className: string - Custom classes cho container
// ==========================================

const SearchBar = ({
    placeholder = 'Tìm kiếm theo tên sách hoặc tác giả...',
    value: controlledValue,
    onChange,
    onSearch,
    onClose,
    className = '',
}) => {
    // State nội bộ nếu không dùng controlled mode
    const [internalValue, setInternalValue] = useState('');

    // Xác định giá trị hiển thị (controlled hoặc uncontrolled)
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    // Handle input change
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (onChange) {
            onChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(value);
        }
    };

    // Handle close button click - tắt chức năng search
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`
                relative flex items-center w-full
                bg-white rounded-full
                border border-border
                shadow-sm
                transition-shadow duration-200
                hover:shadow-md focus-within:shadow-md focus-within:border-primary/30
                ${className}
            `}
        >
            {/* Search Icon */}
            <span className="absolute left-4 text-text-sub pointer-events-none">
                <Search size={20} strokeWidth={2} />
            </span>

            {/* Input Field */}
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="
                    w-full py-3 pl-12 pr-12
                    bg-transparent
                    text-text-primary text-sm
                    placeholder:text-text-sub/60
                    outline-none
                    rounded-full
                "
            />

            {/* Close Button - luôn hiển thị, dùng để tắt chức năng search */}
            <button
                type="button"
                onClick={handleClose}
                className="
                    absolute right-3
                    p-1.5
                    text-text-sub
                    hover:text-text-primary
                    transition-colors duration-200
                "
                aria-label="Đóng tìm kiếm"
            >
                <X size={18} strokeWidth={2} />
            </button>
        </form>
    );
};

export default SearchBar;
