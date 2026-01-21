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

import AdminPageLayout from "@/componants/layouts/AdminPageLayout";
import AdminTabs from "@/componants/ui/AdminTabs";
import AdminSection from "@/componants/layouts/AdminSection";

import { getRecentBooks } from "@/services/book.service";
import { getRecentBorrowTickets, getRecentReturnTickets } from "@/services/borrow-ticket.service";

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
            const [booksRes, borrowRes, returnRes] = await Promise.all([
                getRecentBooks(),
                getRecentBorrowTickets(),
                getRecentReturnTickets()
            ]);

            // Helper to get array from response (handle { data: [...] } or [...])
            const getList = (res) => Array.isArray(res) ? res : (res?.data || []);

            // Normalize Data
            const normalizedBooks = getList(booksRes).map(item => ({
                id: `book-${item.book_id || item.id}`,
                type: "add",
                title: "Thêm sách mới",
                desc: `"${item.title}" được thêm bởi ${item.created_by_name || "Admin"}`,
                time: item.created_at || item.createdAt,
                timestamp: new Date(item.created_at || item.createdAt).getTime(),
                status: null
            }));

            const normalizedBorrow = getList(borrowRes).map(item => ({
                id: `borrow-${item.ticket_id || item.id}`,
                type: "borrow",
                title: "Mượn sách",
                desc: `${item.member_name || item.user?.fullName || "Khách"} đã mượn sách`,
                time: item.created_at || item.borrowDate,
                timestamp: new Date(item.created_at || item.borrowDate).getTime(),
                status: null
            }));

            const normalizedReturn = getList(returnRes).map(item => ({
                id: `return-${item.ticket_id || item.id}`,
                type: "return",
                title: "Trả sách",
                desc: `${item.member_name || item.user?.fullName || "Khách"} đã trả sách`,
                time: item.returned_at || item.returnDate || item.updatedAt,
                timestamp: new Date(item.returned_at || item.returnDate || item.updatedAt).getTime(),
                status: null
            }));

            // Merge & Sort
            const allActivities = [...normalizedBooks, ...normalizedBorrow, ...normalizedReturn];
            allActivities.sort((a, b) => b.timestamp - a.timestamp);

            setActivities(allActivities);
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
