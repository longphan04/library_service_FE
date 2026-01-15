// ==========================================
// Component: Avatar
// Mô tả: Component hiển thị avatar người dùng
// Vị trí: src/components/ui/Avatar.jsx
// ==========================================

const Avatar = ({
    src = '',
    alt = 'Avatar',
    size = 'md',
    className = '',
}) => {
    // Size variants
    const sizeStyles = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    // Fallback với chữ cái đầu
    const initials = alt
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className={`
                ${sizeStyles[size] || sizeStyles.md}
                rounded-full overflow-hidden bg-primary/10
                flex items-center justify-center
                ${className}
            `}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-primary font-medium text-sm">
                    {initials}
                </span>
            )}
        </div>
    );
};

export default Avatar;
