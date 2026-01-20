// ==========================================
// Component: Skeleton
// Mô tả: Component loading skeleton
// ==========================================

const Skeleton = ({
    width = '100%',
    height = '1rem',
    rounded = 'md',
    className = '',
}) => {
    const roundedStyles = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    };

    return (
        <div
            className={`bg-gray-200 animate-pulse ${roundedStyles[rounded]} ${className}`}
            style={{ width, height }}
        />
    );
};

export default Skeleton;
