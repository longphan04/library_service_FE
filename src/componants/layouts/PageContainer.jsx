export default function PageContainer({ children, className = "" }) {
    return (
        <div className={`w-full bg-bg-app pb-10 ${className}`}>
            {children}
        </div>
    );
}
