export default function PageContainer({ children, className = "" }) {
    return (
        <div className={`w-full bg-[#F6EFE7] pb-10 ${className}`}>
            {children}
        </div>
    );
}
