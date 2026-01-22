// ==========================================
// Component: InputField
// Mô tả: Component input tái sử dụng với icon, label, error message và toggle password
// Vị trí: src/components/ui/InputField.jsx
// ==========================================

import { useState } from 'react';

// ==========================================
// SVG Icons cho Show/Hide Password
// ==========================================

// Icon mắt mở - hiển thị khi password đang ẩn (click để hiện)
const EyeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

// Icon mắt đóng (gạch chéo) - hiển thị khi password đang hiện (click để ẩn)
const EyeOffIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

// ==========================================
// Props:
// - id: string - ID của input (required)
// - label: string - Label hiển thị phía trên input
// - type: string - Loại input (text, email, password)
// - value: string - Giá trị của input
// - onChange: function - Handler khi giá trị thay đổi
// - placeholder: string - Placeholder text
// - icon: ReactNode - Icon hiển thị bên trái input
// - error: string - Thông báo lỗi nếu có
// - disabled: boolean - Trạng thái disabled
// ==========================================

const InputField = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    icon = null,
    error = '',
    disabled = false,
}) => {
    // State quản lý ẩn/hiện mật khẩu (chỉ dùng cho type="password")
    const [showPassword, setShowPassword] = useState(false);

    // Xác định type thực tế của input
    // Nếu type là password và showPassword = true -> hiển thị text
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Kiểm tra có phải là password field không để hiển thị toggle icon
    const isPasswordField = type === 'password';

    // Handler toggle ẩn/hiện mật khẩu
    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
        // Container chính của input field
        <div className="space-y-2">
            {/* ==========================================
                Label Section
                Mô tả: Hiển thị label phía trên input
            ========================================== */}
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-text-primary"
                >
                    {label}
                </label>
            )}

            {/* ==========================================
                Input Container
                Mô tả: Chứa icon, input field và toggle button
            ========================================== */}
            <div className="relative">
                {/* Icon bên trái input (nếu có) */}
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        {icon}
                    </span>
                )}

                {/* Input field */}
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full py-2.5 bg-bg-section border rounded-full 
                        text-text-primary placeholder-text-sub 
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
                        transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${icon ? 'pl-10' : 'px-4'}
                        ${isPasswordField ? 'pr-12' : 'pr-4'}
                        ${error ? 'border-error' : 'border-border'}
                    `}
                />

                {/* ==========================================
                    Toggle Password Button
                    Mô tả: Nút ẩn/hiện mật khẩu (chỉ hiển thị khi type="password")
                    - type="button" để tránh submit form khi click
                ========================================== */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={handleTogglePassword}
                        disabled={disabled}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>

            {/* ==========================================
                Error Message
                Mô tả: Hiển thị thông báo lỗi màu đỏ nếu có
            ========================================== */}
            {error && (
                <p className="text-sm text-error mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;
