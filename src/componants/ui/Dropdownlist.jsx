import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown Component - Dropdown chọn giá trị với Tailwind CSS
 * @param {Array} options - Danh sách options [{value, label}]
 * @param {string} value - Giá trị đang chọn
 * @param {function} onChange - Hàm xử lý khi đổi giá trị
 * @param {string} placeholder - Placeholder khi chưa chọn
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} disabled - Trạng thái disabled
 */
const Dropdown = ({
    options = [],
    value,
    onChange,
    placeholder = 'Chọn...',
    size = 'md',
    disabled = false,
    className = '',
    ...props
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

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (option) => {
        onChange?.(option.value);
        setIsOpen(false);
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg'
    };

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef} {...props}>
            {/* Trigger Button */}
            <button
                type="button"
                className={`
          flex items-center justify-between gap-2 
          bg-bg-section border border-border rounded-lg
          text-text-primary
          hover:bg-bg-card-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          min-w-[100px]
          ${sizeStyles[size]}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-text-sub transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full min-w-[120px] bg-bg-section border border-border rounded-lg shadow-lg overflow-hidden">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`
                w-full px-3 py-2 text-left
                hover:bg-bg-card-hover
                transition-colors duration-150
                ${option.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-text-primary'}
              `}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
