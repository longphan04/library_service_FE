import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    PlusCircle,
    BookOpen,
    CornerDownLeft,
    Loader2
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import AdminTabs from "@/components/ui/AdminTabs";
import AdminSection from "@/components/layouts/AdminSection";

import { getRecentActivity } from "@/services/dashboard.service";

// Config dayjs
dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function InventoryLog() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getRecentActivity();

            // Defensive: Check if response and response.data exist before destructuring
            if (!response || !response.data) {
                console.warn("API returned empty or invalid response");
                setActivities([]);
                return;
            }

            const { recent_book, recent_borrow_ticket, recent_return_ticket } = response.data;

            const activitiesList = [];

            // 1. Recent Book (Add)
            if (recent_book) {
                activitiesList.push({
                    id: `book-${recent_book.book_id}`,
                    type: "add",
                    title: "Thêm sách mới",
                    desc: `"${recent_book.title}" được thêm bởi ${recent_book.created_by_name || "Admin"}`,
                    timestamp: new Date(recent_book.created_at).getTime(),
                });
            }

            // 2. Recent Borrow Ticket
            if (recent_borrow_ticket) {
                activitiesList.push({
                    id: `borrow-${recent_borrow_ticket.ticket_id}`,
                    type: "borrow",
                    title: "Mượn sách",
                    desc: `${recent_borrow_ticket.member_name} đã mượn ${recent_borrow_ticket.item_count} sách`,
                    timestamp: new Date(recent_borrow_ticket.created_at).getTime(),
                });
            }

            // 3. Recent Return Ticket
            if (recent_return_ticket) {
                activitiesList.push({
                    id: `return-${recent_return_ticket.ticket_id}`,
                    type: "return",
                    title: "Trả sách",
                    desc: `${recent_return_ticket.member_name} đã trả ${recent_return_ticket.item_count} sách`,
                    timestamp: new Date(recent_return_ticket.returned_at).getTime(),
                });
            }

            // Sort by timestamp newly first
            activitiesList.sort((a, b) => b.timestamp - a.timestamp);

            setActivities(activitiesList);
        } catch (error) {
            console.error("Failed to fetch inventory logs", error);
        } finally {
            setLoading(false);
        }
    };

    const iconMap = {
        add: <PlusCircle size={26} />,
        borrow: <BookOpen size={26} />,
        return: <CornerDownLeft size={26} />,
    };

    return (
        <AdminPageLayout title="Biến động kho">

            {/* TAB NAVIGATION */}
            <AdminTabs active="inventory-log" />

            {/* ACTIVITY LIST */}
            <AdminSection>
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#D9A37B]" size={40} />
                    </div>
                ) : (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {activities.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                Không có hoạt động nào gần đây.
                            </div>
                        ) : (
                            activities.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 last:border-0"
                                >
                                    {/* LEFT */}
                                    <div className="flex gap-4">
                                        <div className="text-[#7A4A2E] mt-1 shrink-0">
                                            {iconMap[item.type]}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="font-semibold text-lg text-[#4A3728]">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <p className="text-gray-600 text-sm mt-1">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* TIME */}
                                    <span className="text-sm text-gray-400 whitespace-nowrap shrink-0 ml-2">
                                        {dayjs(item.timestamp).format('DD/MM/YYYY HH:mm')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </AdminSection>

        </AdminPageLayout>
    );
}
