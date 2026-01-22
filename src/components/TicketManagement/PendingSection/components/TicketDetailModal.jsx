import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FALLBACK_IMAGES } from '../../../../utils/imageUrl';

// Mock data cho books
const MOCK_BOOKS = [
  {
    id: "B001",
    name: "Nhà Giả Kim",
    author: "Paulo Coelho",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
    quantity: 2,
    category: "Tiểu thuyết",
    publishYear: 1988
  },
  {
    id: "B002",
    name: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=140&fit=crop",
    quantity: 1,
    category: "Self-help",
    publishYear: 1936
  },
  {
    id: "B003",
    name: "Trí Tuệ Do Thái",
    author: "Eran Katz",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=140&fit=crop",
    quantity: 3,
    category: "Kinh doanh",
    publishYear: 2006
  }
];

export default function TicketDetailModal({
  open,
  onClose,
  ticket,
  onConfirm,
  onReject,
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
    if (open && ticket) {
      // Mock user info dựa trên ticket
      const mockUserInfo = {
        name: ticket.userName || "Người dùng",
        email: ticket.email || "email@example.com",
        cardId: ticket.cardId || "000000",
        phone: "0123 456 789",
        address: "123 Đường ABC, Quận XYZ",
        joinDate: "15/03/2023",
        borrowedBooks: 5,
        totalFine: 0
      };

      // Mock books data (lấy số lượng sách từ ticket.quantity)
      const bookCount = ticket.quantity || 3;
      const initialBooks = MOCK_BOOKS.slice(0, bookCount).map(book => ({
        ...book,
        quantity: Math.min(book.quantity, 2) // Giới hạn số lượng
      }));

      setUserInfo(mockUserInfo);
      setBooks(initialBooks);
    } else {
      // Reset state khi modal đóng
      setBooks([]);
      setUserInfo(null);
    }
  }, [open, ticket]);

  // Nếu modal không mở, return null SAU KHI đã khai báo tất cả hooks
  if (!open || !ticket) return null;

  // Xử lý xác nhận toàn bộ ticket
  const handleConfirm = () => {
    console.log("Xác nhận toàn bộ ticket:", ticket.id);

    // Gọi callback từ parent
    if (onConfirm) {
      onConfirm(ticket.id, books); // Truyền toàn bộ books
    }

    onClose();
  };

  // Xử lý từ chối toàn bộ ticket
  const handleReject = () => {
    console.log("Từ chối toàn bộ ticket:", ticket.id);

    // Gọi callback từ parent
    if (onReject) {
      onReject(ticket.id);
    }

    onClose();
  };

  // Tính tổng số lượng sách
  const totalQuantity = books.reduce((sum, book) => sum + book.quantity, 0);

  // Kiểm tra nếu ticket đã bị từ chối
  const isRejected = ticket.status === "rejected";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* MODAL với background màu #F5EBE0 */}
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#F5EBE0" }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết phiếu mượn
            </h2>
            <p className="text-gray-600 mt-1">
              Mã phiếu: <span className="font-semibold text-[#7A4A2E]">{ticket.id}</span>
              {isRejected && (
                <span className="ml-3 px-3 py-1 bg-black text-white text-sm rounded">
                  Đã từ chối
                </span>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
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
                <p className="text-sm text-gray-500">Ngày tham gia</p>
                <p className="font-medium">{userInfo?.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số sách đang mượn</p>
                <p className="font-medium">{userInfo?.borrowedBooks}</p>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Danh sách sách yêu cầu mượn
              </h3>
              <div className="text-sm text-gray-600">
                Tổng: {books.length} sách • {totalQuantity} bản
              </div>
            </div>

            {/* TABLE HEADER - Không có checkbox */}
            <div className="grid grid-cols-[100px_2fr_1fr_1fr_120px] bg-[#7A4A2E] text-white px-4 py-3 rounded-t">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>Tác giả</div>
              <div>ID sách</div>
              <div>Số lượng</div>
            </div>

            {/* TABLE BODY - Không có checkbox */}
            <div className="max-h-[40vh] overflow-y-auto border border-t-0 rounded-b bg-white">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="grid grid-cols-[100px_2fr_1fr_1fr_120px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
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
                    <div className="text-sm text-gray-500">{book.category}</div>
                  </div>

                  <div className="text-gray-700">{book.author}</div>

                  <div className="font-mono text-[#7A4A2E] font-medium">
                    {book.id}
                  </div>

                  <div className="font-semibold">{book.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER - ACTION BUTTONS */}
        <div className="border-t border-gray-300 p-6 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <span className="font-medium">Tổng số sách: {books.length}</span>
              <span className="mx-2">•</span>
              <span>Tổng số bản: {totalQuantity}</span>
            </div>

            <div className="flex gap-4">
              {/* Nếu ticket đã bị từ chối, chỉ hiển thị thông báo */}
              {isRejected ? (
                <div className="px-8 py-4 bg-black text-white rounded-lg font-medium text-center min-w-[120px]">
                  Đã từ chối
                </div>
              ) : (
                <>
                  <button
                    onClick={handleReject}
                    className="px-8 py-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-base"
                    style={{ backgroundColor: "#DE6767", minWidth: "120px" }}
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-8 py-4 text-white rounded-lg font-medium hover:opacity-90 transition text-base"
                    style={{ backgroundColor: "#7A4A2E", minWidth: "120px" }}
                  >
                    Xác nhận
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}