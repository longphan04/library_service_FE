export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-white/75 z-40"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl px-10 py-8 w-105">
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
