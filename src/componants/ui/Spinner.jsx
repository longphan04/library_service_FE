// ==========================================
// Component: Spinner
// Mô tả: Component loading spinner
// ==========================================

const Spinner = ({
    size = 'md',
    className = '',
}) => {
    const sizeStyles = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    return (
        <div
            className={`${sizeStyles[size]} border-2 border-primary/30 border-t-primary rounded-full animate-spin ${className}`}
        />
    );
};

export default Spinner;
