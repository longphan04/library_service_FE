// ==========================================
// Component: PopUp
// Mô tả: Component popup notification
// ==========================================

import { X } from 'lucide-react';

const PopUp = ({
    isOpen = false,
    onClose,
    type = 'info', // 'success' | 'error' | 'warning' | 'info'
    title = '',
    message = '',
    className = '',
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        success: 'bg-success/10 border-success text-success',
        error: 'bg-error/10 border-error text-error',
        warning: 'bg-warning/10 border-warning text-warning',
        info: 'bg-primary/10 border-primary text-primary',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${className}`}>
            <div className={`p-4 rounded-lg border-l-4 shadow-lg bg-bg-section ${typeStyles[type]}`}>
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        {title && (
                            <h4 className="font-medium mb-1">{title}</h4>
                        )}
                        <p className="text-sm text-text-primary">{message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-text-sub hover:text-text-primary"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
