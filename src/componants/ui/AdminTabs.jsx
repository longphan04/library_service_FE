import { useNavigate } from "react-router-dom";

export default function AdminTabs({ active }) {
    const navigate = useNavigate();

    const tabs = [
        { key: "statistics", label: "Thống kê", path: "/admin/statistics" },
        { key: "inventory", label: "Tồn kho", path: "/admin/inventory" },
        { key: "inventory-log", label: "Biến động kho", path: "/admin/inventory-log" },
    ];

    return (
        <div className="flex justify-center gap-4 mb-8">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => tab.key !== active && navigate(tab.path)}
                    className={`px-6 py-2 rounded-full
            ${active === tab.key
                            ? "bg-primary-hover text-text-on-primary cursor-default"
                            : "bg-secondary text-text-on-secondary hover:opacity-90"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
