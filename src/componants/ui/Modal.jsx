// ==========================================
// Component: Modal
// Mô tả: Component modal/dialog
// ==========================================

import { X } from 'lucide-react';

const Modal = ({
    isOpen = false,
    onClose,
    title = '',
    children,
    size = 'md',
    className = '',
}) => {
    if (!isOpen) return null;

    const sizeStyles = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-bg-section rounded-2xl shadow-xl w-full mx-4 ${sizeStyles[size]} ${className}`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-text-primary">
                            {title}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 rounded-full text-text-sub hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
