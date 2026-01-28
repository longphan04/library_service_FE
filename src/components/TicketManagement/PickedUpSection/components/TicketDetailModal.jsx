import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FALLBACK_IMAGES } from "@/utils/imageUrl";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { pickedUpTicketStaffService } from "@/services/pickedUpTicketStaff.service";

export default function TicketDetailModal({
    open,
    onClose,
    ticket,
    onConfirm,
    onWarn,
}) {
    const [books, setBooks] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    // Effect để disable scroll khi modal mở
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    // Effect để khởi tạo dữ liệu khi modal mở
    useEffect(() => {
        if (open && ticket?.id) {
            // Reset state trước khi fetch
            setBooks([]);
            setUserInfo(null);

            pickedUpTicketStaffService.getTicketDetail(ticket.id)
                .then(data => {
                    if (data) {
                        setUserInfo({
                            ...data.user,
                            requestedAt: data.requestedAt,
                            approvedAt: data.approvedAt,
                            pickedUpAt: data.pickedUpAt,
                            dueDate: data.dueDate
                        });
                        setBooks(data.books);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [open, ticket]);

    if (!open || !ticket) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: "#F5EBE0" }}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-gray-300">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chi tiết phiếu mượn sách
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Mã phiếu: <span className="font-semibold text-[#7A4A2E]">{ticket.id}</span>
                            <span className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                                Đã nhận sách
                            </span>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* User Info Section */}
                    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin người mượn</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Họ tên</p>
                                <p className="font-medium">{userInfo?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{userInfo?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Mã thẻ</p>
                                <p className="font-medium">{userInfo?.cardId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium">{userInfo?.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ngày nhận sách</p>
                                <p className="font-medium">{userInfo?.pickedUpAt ? new Date(userInfo.pickedUpAt).toLocaleString("vi-VN") : "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Hạn trả sách</p>
                                <p className="font-medium text-red-600 font-semibold">{userInfo?.dueDate ? new Date(userInfo.dueDate).toLocaleString("vi-VN") : "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Books Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Danh sách sách đang mượn
                            </h3>
                            <div className="text-sm text-gray-600">
                                Tổng: {books.length} bản
                            </div>
                        </div>

                        <div className="grid grid-cols-[100px_2fr_1fr_100px] bg-[#7A4A2E] text-white px-4 py-3 rounded-t">
                            <div>Ảnh</div>
                            <div>Tên sách</div>
                            <div>ID sách</div>
                            <div className="text-center">Bản số</div>
                        </div>

                        <div className="max-h-[40vh] overflow-y-auto border border-t-0 rounded-b bg-white">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className="grid grid-cols-[100px_2fr_1fr_100px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
                                >
                                    <img
                                        src={book.image}
                                        alt={book.name}
                                        className="w-14 h-20 object-cover rounded shadow"
                                        onError={(e) => {
                                            e.target.src = FALLBACK_IMAGES.book;
                                        }}
                                    />
                                    <div>
                                        <div className="font-medium text-gray-800">{book.name}</div>
                                        {book.category && book.category !== "—" && (
                                            <div className="text-sm text-gray-500">{book.category}</div>
                                        )}
                                    </div>
                                    <div className="font-mono text-[#7A4A2E] font-medium">
                                        {book.bookId}
                                    </div>
                                    <div className="font-semibold text-center">
                                        {book.id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-gray-300 p-6 bg-white">
                    <div className="flex justify-between items-center">
                        <div className="text-gray-600">
                            <span className="font-medium">Tổng số bản: {books.length}</span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    if (ticket?.id) {
                                        onConfirm && onConfirm(ticket.id);
                                    }
                                }}
                                className="px-8 py-4 text-white rounded-lg font-medium hover:opacity-90 transition text-base cursor-pointer"
                                style={{ backgroundColor: "#7A4A2E", minWidth: "140px" }}
                            >
                                Xác nhận trả sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
