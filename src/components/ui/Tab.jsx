// ==========================================
// Component: Tab
// Mô tả: Component tabs navigation
// ==========================================

const Tab = ({
    tabs = [],
    activeTab = 0,
    onTabChange,
    className = '',
}) => {
    return (
        <div className={`flex border-b border-border ${className}`}>
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onTabChange?.(index)}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === index
                            ? 'text-primary border-primary'
                            : 'text-text-sub border-transparent hover:text-text-primary'
                        }`}
                >
                    {tab.label || tab}
                </button>
            ))}
        </div>
    );
};

export default Tab;
