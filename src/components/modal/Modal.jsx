export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    const handleBackdropClick = (e) => {
        // Chỉ close modal khi click trực tiếp trên backdrop
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-white/75 z-40 cursor-pointer"
                onClick={handleBackdropClick}
            />
            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                {/* Modal Content */}
                <div 
                    className="bg-white rounded-2xl shadow-xl px-10 py-8 w-105 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <h2 className="text-xl font-semibold text-center mb-6">
                            {title}
                        </h2>
                    )}
                    {children}
                </div>
            </div>
        </>
    );
}
