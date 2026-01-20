import { useNavigate } from "react-router-dom";
import {
    PlusCircle,
    BookOpen,
    CornerDownLeft
} from "lucide-react";

import AdminPageLayout from "@/componants/layouts/AdminPageLayout";
import AdminTabs from "@/componants/ui/AdminTabs";
import AdminSection from "@/componants/layouts/AdminSection";

export default function InventoryLog() {
    const navigate = useNavigate();

    const activities = [
        {
            id: 1,
            type: "add",
            title: "Thêm sách mới",
            desc: 'Đã thêm 5 cuốn "Vợ nhặt" vào kho',
            time: "Hôm nay, 10 giờ 30 phút",
        },
        {
            id: 2,
            type: "borrow",
            title: "Mượn sách",
            desc: '"Truyện cổ tích" được mượn bởi user123',
            time: "Hôm nay, 9 giờ 30 phút",
        },
        {
            id: 3,
            type: "return",
            title: "Trả sách",
            desc: '"Vợ nhặt" được trả bởi i23user',
            time: "Hôm nay, 9 giờ 0 phút",
            status: "Đúng hạn",
        },
    ];

    const iconMap = {
        add: <PlusCircle size={26} />,
        borrow: <BookOpen size={26} />,
        return: <CornerDownLeft size={26} />,
    };

    return (
        <AdminPageLayout title="Biến động kho">

            {/* TAB NAVIGATION */}
            <AdminTabs
                tabs={[
                    {
                        label: "Thống kê",
                        onClick: () => navigate("/admin/statistics"),
                    },
                    {
                        label: "Tồn kho",
                        onClick: () => navigate("/admin/inventory"),
                    },
                    {
                        label: "Biến động kho",
                        active: true,
                    },
                ]}
            />

            {/* ACTIVITY LIST */}
            <AdminSection>
                <div className="space-y-6">
                    {activities.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start justify-between gap-4"
                        >
                            {/* LEFT */}
                            <div className="flex gap-4">
                                <div className="text-[#7A4A2E] mt-1">
                                    {iconMap[item.type]}
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-lg">
                                            {item.title}
                                        </h3>

                                        {item.status && (
                                            <span
                                                className="px-3 py-1 text-sm
                                                rounded-full bg-green-500 text-white"
                                            >
                                                {item.status}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            {/* TIME */}
                            <span className="text-sm text-gray-400 whitespace-nowrap">
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>
            </AdminSection>

        </AdminPageLayout>
    );
}
