// ==========================================
// Component: Toast
// Mô tả: Toast notification với auto-hide
// Vị trí: src/components/ui/Toast.jsx
// ==========================================

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Component - Notification popup
 * @param {boolean} isOpen - Show/hide toast
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Message to display
 * @param {function} onClose - Handler to close toast
 * @param {number} duration - Auto-hide duration in ms (default 3000)
 */
const Toast = ({
    isOpen = false,
    type = 'info',
    message = '',
    onClose,
    duration = 3000,
}) => {
    // Auto-hide after duration
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    // Icon mapping
    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    // Style mapping
    const styles = {
        success: 'bg-success/10 border-success text-success',
        error: 'bg-error/10 border-error text-error',
        warning: 'bg-warning/10 border-warning text-warning',
        info: 'bg-primary/10 border-primary text-primary',
    };

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100 animate-slide-down">
            <div
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg
                    bg-bg-section min-w-[320px] max-w-md
                    ${styles[type]}
                `}
            >
                {/* Icon */}
                <div className="shrink-0">
                    {icons[type]}
                </div>

                {/* Message */}
                <p className="flex-1 text-sm font-medium text-text-primary">
                    {message}
                </p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="shrink-0 text-text-sub hover:text-text-primary transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
