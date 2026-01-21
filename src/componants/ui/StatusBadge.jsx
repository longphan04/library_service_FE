/**
 * StatusBadge Component
 * Displays user/staff status with appropriate styling
 */
export default function StatusBadge({ status, isActive, className = "" }) {
    // Determine if the user/staff is active
    const active = status === "active" || isActive;

    return (
        <span
            className={`w-22.5 h-7
                flex items-center justify-center
                rounded-[14px] text-sm text-white
                ${active ? "bg-green-500" : "bg-red-500"}
                ${className}`}
        >
            {active ? "Hoạt động" : "Bị khóa"}
        </span>
    );
}
