// ==========================================
// Component: SmallNotification
// Mô tả: Component thông báo nhỏ inline
// ==========================================

const SmallNotification = ({
    type = 'info', // 'success' | 'error' | 'warning' | 'info'
    message = '',
    className = '',
}) => {
    const typeStyles = {
        success: 'text-success',
        error: 'text-error',
        warning: 'text-warning',
        info: 'text-primary',
    };

    if (!message) return null;

    return (
        <p className={`text-sm ${typeStyles[type]} ${className}`}>
            {message}
        </p>
    );
};

export default SmallNotification;
