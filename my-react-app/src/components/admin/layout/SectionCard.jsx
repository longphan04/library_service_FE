export default function SectionCard({ title, children }) {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-10">
            {title && (
                <h2 className="text-2xl font-semibold mb-6">
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}
