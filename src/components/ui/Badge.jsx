import React from 'react';

/**
 * Badge Component - Nhãn hiển thị category hoặc status với Tailwind CSS
 * @param {string} variant - 'primary' | 'secondary' | 'success' | 'warning' | 'error'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} rounded - Bo tròn hoàn toàn
 */
const Badge = ({
    variant = 'primary',
    size = 'md',
    rounded = false,
    children,
    className = '',
    ...props
}) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium';

    // Variant styles
    const variantStyles = {
        primary: 'bg-primary text-text-on-primary',
        secondary: 'bg-secondary text-text-on-secondary',
        success: 'bg-success text-white',
        warning: 'bg-warning text-white',
        error: 'bg-error text-white'
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    // Rounded styles
    const roundedStyles = rounded ? 'rounded-full' : 'rounded-md';

    const classes = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles,
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {children}
        </span>
    );
};

export default Badge;
