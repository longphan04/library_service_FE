import React from 'react';

/**
 * Button Component - Nút bấm với Tailwind CSS
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Nút chiếm toàn bộ chiều rộng
 * @param {boolean} disabled - Trạng thái disabled
 * @param {ReactNode} leftIcon - Icon bên trái
 * @param {ReactNode} rightIcon - Icon bên phải
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    leftIcon = null,
    rightIcon = null,
    onClick,
    children,
    className = '',
    type = 'button',
    ...props
}) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
        primary: 'bg-primary text-text-on-primary hover:bg-primary-hover',
        secondary: 'bg-secondary text-text-on-secondary border border-secondary-border hover:bg-secondary-hover',
        outline: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-text-on-primary',
        ghost: 'bg-transparent text-primary hover:bg-bg-card-hover'
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2.5'
    };

    const classes = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </button>
    );
};

export default Button;
