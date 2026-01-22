// ==========================================
// Component: Toast
// Mô tả: Toast notification với auto-hide
// 
// Vị trí hiển thị: Top-right, dưới header (top-20 = 80px)
// Z-index: 50 (dưới modal nhưng trên content)
//
// Vị trí: src/components/ui/Toast.jsx
// ==========================================

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Component - Notification popup
 * 
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
    // ==========================================
    // Auto-hide sau duration (ms)
    // ==========================================
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    // Không render nếu không mở
    if (!isOpen) return null;

    // ==========================================
    // Icon mapping theo type
    // ==========================================
    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    // ==========================================
    // Style mapping theo type
    // ==========================================
    const styles = {
        success: 'bg-green-50 border-green-500 text-green-600',
        error: 'bg-red-50 border-red-500 text-red-600',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-600',
        info: 'bg-blue-50 border-blue-500 text-blue-600',
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <div
            className="fixed top-20 right-4 z-50"
            role="alert"
            aria-live="polite"
        >
            <div
                className={`
                    flex items-center gap-3 
                    px-4 py-3 
                    rounded-lg border-l-4 
                    shadow-lg backdrop-blur-sm
                    min-w-[280px] max-w-sm
                    animate-in slide-in-from-right duration-300
                    ${styles[type]}
                `}
            >
                {/* Icon */}
                <div className="shrink-0">
                    {icons[type]}
                </div>

                {/* Message */}
                <p className="flex-1 text-sm font-medium">
                    {message}
                </p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
                    aria-label="Đóng thông báo"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
