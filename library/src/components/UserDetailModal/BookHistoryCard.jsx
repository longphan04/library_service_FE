import { useState } from "react";
import { ChevronDown, ChevronUp, Bell } from "lucide-react";
import BookItem from "./BookItem";

export default function BookHistoryCard({ history, onSendWarning }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const total = history.books.length;
    const returned = history.books.filter(b => b.returned).length;
    const completed = returned === total;

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="bg-[#F5EBE0] border rounded-xl p-5 hover:shadow-md transition-shadow">
            {/* CARD HEADER */}
            <div className="grid grid-cols-6 items-center text-base text-[#7A4A2E] mb-4 gap-6">
                {/* ID */}
                <div className="font-medium min-w-[100px]">
                    <div className="text-sm text-gray-500">Mã mượn</div>
                    <div className="font-semibold text-lg">#{history.id}</div>
                </div>

                {/* Số lượng */}
                <div className="font-medium min-w-[100px]">
                    <div className="text-sm text-gray-500">Số lượng</div>
                    <div className="font-semibold text-lg">
                        {returned}/{total}
                    </div>
                </div>

                {/* Ngày hết hạn */}
                <div className="font-medium min-w-[120px]">
                    <div className="text-sm text-gray-500">Hết hạn</div>
                    <div className="font-semibold text-lg">{history.expired}</div>
                </div>

                {/* Trạng thái */}
                <div className="font-medium min-w-[120px]">
                    <div className="text-sm text-gray-500">Trạng thái</div>
                    <span
                        className={`px-3 py-1.5 rounded-full text-white font-semibold inline-block ${
                            completed
                                ? "bg-green-600"
                                : "bg-red-500"
                        }`}
                    >
                        {completed ? "Đã trả" : "Chưa trả"}
                    </span>
                </div>

                {/* Nút cảnh báo */}
                <div className="flex items-center justify-center min-w-[120px]">
                    {!completed && (
                        <button
                            onClick={() => onSendWarning(history.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors"
                            title="Gửi cảnh báo qua email"
                        >
                            <Bell size={18} />
                            Cảnh báo
                        </button>
                    )}
                </div>

                {/* Dropdown button */}
                <div className="flex justify-end min-w-[60px]">
                    <button
                        onClick={toggleOpen}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
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
                    {history.books.map((book) => (
                        <BookItem key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}