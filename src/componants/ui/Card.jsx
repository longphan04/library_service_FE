import React from 'react';

/**
 * Card Component - Container component với Tailwind CSS
 * @param {string} variant - 'default' | 'elevated' | 'outlined'
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 * @param {boolean} hoverable - Có hiệu ứng hover không
 * @param {boolean} clickable - Có thể click được không
 */
const Card = ({
    variant = 'default',
    padding = 'md',
    hoverable = false,
    clickable = false,
    onClick,
    children,
    className = '',
    ...props
}) => {
    // Base styles
    const baseStyles = 'bg-bg-section rounded-xl transition-all duration-200';

    // Variant styles
    const variantStyles = {
        default: '',
        elevated: 'shadow-lg',
        outlined: 'border border-border'
    };

    // Padding styles
    const paddingStyles = {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6'
    };

    // Hover styles
    const hoverStyles = hoverable ? 'hover:bg-bg-card-hover hover:shadow-md' : '';

    // Clickable styles
    const clickableStyles = clickable ? 'cursor-pointer' : '';

    const classes = [
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        clickableStyles,
        className
    ].filter(Boolean).join(' ');

    const Component = clickable ? 'button' : 'div';

    return (
        <Component
            className={classes}
            onClick={clickable ? onClick : undefined}
            {...props}
        >
            {children}
        </Component>
    );
};

// Card Header
const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`border-b border-border pb-3 mb-3 ${className}`} {...props}>
        {children}
    </div>
);

// Card Body
const CardBody = ({ children, className = '', ...props }) => (
    <div className={`${className}`} {...props}>
        {children}
    </div>
);

// Card Footer
const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`border-t border-border pt-3 mt-3 ${className}`} {...props}>
        {children}
    </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
