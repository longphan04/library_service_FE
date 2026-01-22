// components/admin/AdminPageLayout.jsx
export default function AdminPageLayout({ title, children }) {
    return (
        <div className="w-full min-h-screen bg-[#F6EFE7] pb-10">
            <h1 className="text-3xl font-semibold pt-6 mb-6 text-center">
                {title}
            </h1>

            {children}
        </div>
    );
}
