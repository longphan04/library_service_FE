import { Bell, Info } from "lucide-react";

/**
 * Component hiển thị một mục thông báo trong danh sách dropdown
 */
const SmallNotificationStaff = ({ notification, onClick }) => {
    if (!notification) return null;

    const { title, content, is_read, type, created_at } = notification;

    const formattedTime = created_at ? new Date(created_at).toLocaleString("vi-VN", {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    }) : "";

    return (
        <div
            onClick={onClick}
            className={`flex gap-3 p-4 border-b border-gray-100 last:border-0 cursor-pointer transition-colors
                ${is_read ? 'bg-white hover:bg-gray-50' : 'bg-[#FFF8F1] hover:bg-[#FFF2E5]'}
            `}
        >
            <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                ${is_read ? 'bg-gray-100' : 'bg-primary/10'}
            `}>
                <Bell size={16} className={is_read ? 'text-gray-400' : 'text-primary'} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold truncate pr-4 ${is_read ? 'text-gray-600' : 'text-text-primary'}`}>
                        {title || "Thông báo mới"}
                    </h4>
                    {!is_read && (
                        <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                    )}
                </div>

                <p className={`text-sm leading-relaxed mb-2 ${is_read ? 'text-gray-500' : 'text-text-primary'}`}>
                    {content}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Info size={12} />
                    <span>{formattedTime}</span>
                </div>
            </div>
        </div>
    );
};

export default SmallNotificationStaff;