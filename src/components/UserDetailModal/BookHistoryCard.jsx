import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Bell } from "lucide-react";
import BookItem from "./BookItem";
import { borrowTicketStaffService } from "@/services/borrowTicketStaff.service";
import Spinner from "@/components/ui/Spinner";

export default function BookHistoryCard({ history, onSendWarning }) {
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const ticketId = history.ticket_id || history.id;
    const ticketCode = history.ticket_code || history.cardId;
    const status = history.status;
    const isReturned = status === "RETURNED" || status === "returned";
    const dueDate = history.due_date ? new Date(history.due_date).toLocaleDateString('vi-VN') : history.expired || "—";

    useEffect(() => {
        if (isOpen && !details && !loading) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const data = await borrowTicketStaffService.getTicketDetail(ticketId);
                    setDetails(data);
                } catch (err) {
                    console.error("Error fetching ticket details:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, ticketId, details, loading]);

    const toggleOpen = () => setIsOpen(!isOpen);

    // Get books from details or empty array
    const books = details?.books || [];
    const total = books.length || 0;

    // For the summary info, if we don't have details yet, we might not know the exact count
    // but we can show the status
    const statusLabel = () => {
        switch (status?.toUpperCase()) {
            case "PENDING": return { label: "Chờ duyệt", color: "bg-yellow-500" };
            case "APPROVED": return { label: "Đã duyệt", color: "bg-blue-500" };
            case "PICKED_UP": return { label: "Đang mượn", color: "bg-orange-500" };
            case "RETURNED": return { label: "Đã trả", color: "bg-green-600" };
            case "CANCELLED": return { label: "Đã hủy", color: "bg-gray-500" };
            case "REJECTED": return { label: "Từ chối", color: "bg-red-600" };
            default: return { label: status, color: "bg-primary" };
        }
    };

    const statusConfig = statusLabel();

    return (
        <div className="bg-bg-app border rounded-xl p-5 hover:shadow-md transition-shadow">
            {/* CARD HEADER */}
            <div className="grid grid-cols-6 items-center text-base text-primary mb-4 gap-6">
                {/* ID */}
                <div className="font-medium min-w-[100px]">
                    <div className="text-sm text-gray-500">Mã phiếu</div>
                    <div className="font-semibold text-sm truncate" title={ticketCode}>{ticketCode}</div>
                </div>

                {/* Số lượng - show status if details not loaded, or count if loaded */}
                <div className="font-medium min-w-[100px]">
                    <div className="text-sm text-gray-500">Số lượng</div>
                    <div className="font-semibold text-lg">
                        {loading ? "..." : (details ? total : "—")}
                    </div>
                </div>

                {/* Ngày hết hạn */}
                <div className="font-medium min-w-[120px]">
                    <div className="text-sm text-gray-500">Hết hạn</div>
                    <div className="font-semibold text-lg">{dueDate}</div>
                </div>

                {/* Trạng thái */}
                <div className="font-medium min-w-[120px]">
                    <div className="text-sm text-gray-500">Trạng thái</div>
                    <span
                        className={`px-3 py-1.5 rounded-full text-white font-semibold inline-block text-xs ${statusConfig.color}`}
                    >
                        {statusConfig.label}
                    </span>
                </div>

                {/* Dropdown button */}
                <div className="flex justify-end min-w-[60px]">
                    <button
                        onClick={toggleOpen}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                        aria-label={isOpen ? "Thu gọn" : "Mở rộng"}
                    >
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* BOOK LIST */}
            {isOpen && (
                <div className="space-y-3 mt-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">📖 Danh sách sách:</div>
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Spinner size="sm" />
                        </div>
                    ) : books.length > 0 ? (
                        books.map((book) => (
                            <BookItem
                                key={book.id}
                                book={{
                                    ...book,
                                    title: book.name,
                                    returned: isReturned
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-sm text-gray-400 text-center py-2">Không có thông tin sách</div>
                    )}
                </div>
            )}
        </div>
    );
}