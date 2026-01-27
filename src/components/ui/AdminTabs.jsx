import { useNavigate } from "react-router-dom";

export default function AdminTabs({ active, tabs: customTabs }) {
    const navigate = useNavigate();

    const defaultTabs = [
        { key: "statistics", label: "Thống kê", path: "/admin/statistics" },
        { key: "inventory", label: "Tồn kho", path: "/admin/inventory" },
        { key: "inventory-log", label: "Biến động kho", path: "/admin/inventory-log" },
    ];

    // Support both old API (customTabs with active property) and new API (active prop)
    const tabs = customTabs || defaultTabs;
    
    // Determine active tab
    const getActiveTab = () => {
        if (active) return active;
        if (customTabs) {
            const activeTab = customTabs.find(tab => tab.active);
            return activeTab?.label?.toLowerCase().replace(/\s+/g, '-') || null;
        }
        return null;
    };

    const activeTab = getActiveTab();

    return (
        <div className="flex justify-center gap-4 mb-4">
            {tabs.map((tab, index) => {
                const isActive = customTabs 
                    ? tab.active 
                    : tab.key === active;

                return (
                    <button
                        key={tab.key || index}
                        onClick={() => {
                            if (customTabs && tab.onClick) {
                                tab.onClick();
                            } else if (!customTabs && tab.key !== active) {
                                navigate(tab.path);
                            }
                        }}
                        className={`px-6 py-2 rounded-full transition-colors ${
                            isActive
                                ? "bg-[#D9A37B] text-white cursor-default shadow-sm"
                                : "bg-[#E2C6A6] text-[#7A4A2E] hover:opacity-90 hover:bg-[#D4B595]"
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
