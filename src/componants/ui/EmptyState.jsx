// ==========================================
// Component: EmptyState
// Mô tả: Component hiển thị trạng thái rỗng/không có dữ liệu
// ==========================================

const EmptyState = ({
    icon = null,
    title = 'Không có dữ liệu',
    description = '',
    action = null,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            {icon && (
                <div className="mb-4 text-text-sub">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-text-primary mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-text-sub max-w-md mb-4">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
};

export default EmptyState;
