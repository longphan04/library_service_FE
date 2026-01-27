// components/admin/AdminSection.jsx
export default function AdminSection({ title, children }) {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-10">
            {title && (
                <h2 className="text-2xl font-semibold mb-3">
                    {title}
                </h2>
            )}

            {children}
        </div>
    );
}
