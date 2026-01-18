export default function StatusBadge({ status, labelMap }) {
    const isActive = status === "active" || status === "success";

    return (
        <span
            className={`px-4 py-1 text-sm rounded-full text-white
        ${isActive ? "bg-green-500" : "bg-red-500"}`}
        >
            {labelMap?.[status] ?? status}
        </span>
    );
}
