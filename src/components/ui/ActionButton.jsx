export default function ActionButton({
    children,
    onClick,
    variant = "primary",
    type = "button",
    className = "",
}) {
    const base =
        "px-4 py-2 rounded-lg font-medium transition flex items-center gap-2";

    const variants = {
        primary: "bg-secondary text-text-on-secondary hover:opacity-90",
        success: "bg-green-500 text-white hover:bg-green-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
        outline:
            "border border-gray-300 absolute text-gray-700 hover:bg-gray-100",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className} cursor-pointer`}
        >
            {children}
        </button>
    );
}
