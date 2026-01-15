import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Mock data cho books với nhiều bản sao
const MOCK_BOOKS = [
  {
    id: "B001_1",
    bookId: "B001",
    name: "Nhà Giả Kim",
    author: "Paulo Coelho",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
    category: "Tiểu thuyết",
    publishYear: 1988,
    status: "normal", // normal, extended, overdue, returned
  },
  {
    id: "B001_2",
    bookId: "B001",
    name: "Nhà Giả Kim",
    author: "Paulo Coelho",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
    category: "Tiểu thuyết",
    publishYear: 1988,
    status: "extended", // đã gia hạn
  },
  {
    id: "B002_1",
    bookId: "B002",
    name: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=140&fit=crop",
    category: "Self-help",
    publishYear: 1936,
    status: "overdue", // quá hạn
  },
  {
    id: "B003_1",
    bookId: "B003",
    name: "Trí Tuệ Do Thái",
    author: "Eran Katz",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=140&fit=crop",
    category: "Kinh doanh",
    publishYear: 2006,
    status: "normal",
  },
  {
    id: "B003_2",
    bookId: "B003",
    name: "Trí Tuệ Do Thái",
    author: "Eran Katz",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=140&fit=crop",
    category: "Kinh doanh",
    publishYear: 2006,
    status: "normal",
  }
];

export default function ReturnTicketDetailModal({
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
      
      // Tạo books data với số lượng bản từ ticket.quantity
      let initialBooks = [];
      const bookCount = ticket.quantity || 5;
      
      // Nếu ticket đã completed, tất cả sách đều "returned"
      const isCompleted = ticket.status === "completed";
      
      // Tạo các bản sao của sách
      let bookIndex = 0;
      while (initialBooks.length < bookCount && MOCK_BOOKS.length > 0) {
        const baseBook = MOCK_BOOKS[bookIndex % MOCK_BOOKS.length];
        initialBooks.push({
          ...baseBook,
          id: `${baseBook.bookId}_${initialBooks.length + 1}`,
          // Nếu ticket đã completed, tất cả sách đều returned
          status: isCompleted ? "returned" : baseBook.status
        });
        bookIndex++;
      }
      
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

  // Xử lý trả từng cuốn sách
  const handleReturnBook = (bookId) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, status: "returned" } 
        : book
    ));
    
    console.log(`Đã trả sách: ${bookId}`);
  };

  // Xử lý xác nhận tất cả sách đã trả
  const handleConfirmAll = () => {
    const returnedBooks = books.filter(b => b.status === "returned");
    console.log("Xác nhận đã trả ticket:", ticket.id);
    console.log("Sách đã trả:", returnedBooks.length);
    
    // Gọi callback từ parent
    if (onConfirm) {
      onConfirm(ticket.id, returnedBooks);
    }
    
    onClose();
  };

  // Xử lý cảnh báo
  const handleWarn = () => {
    console.log("Cảnh báo ticket:", ticket.id);
    
    // Gọi callback từ parent
    if (onWarn) {
      onWarn(ticket.id);
    }
  };

  // Tính tổng số lượng sách và số sách đã trả
  const totalBooks = books.length;
  const returnedCount = books.filter(b => b.status === "returned").length;

  // Kiểm tra nếu ticket đã completed
  const isCompleted = ticket.status === "completed";

  // Get status text and color - CHỈ HIỂN THỊ "Đã trả" ở cột tình trạng
  const getStatusInfo = (status) => {
    switch (status) {
      case "extended":
        return { text: "Đã gia hạn", color: "bg-blue-100 text-blue-800" };
      case "overdue":
        return { text: "Quá hạn", color: "bg-red-100 text-red-800" };
      case "returned":
        return { text: "Đã trả", color: "bg-green-100 text-green-800" };
      default:
        return { text: "", color: "" };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* MODAL với background màu #F5EBE0 */}
      <div
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#F5EBE0" }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết phiếu trả sách
            </h2>
            <p className="text-gray-600 mt-1">
              Mã phiếu: <span className="font-semibold text-[#7A4A2E]">{ticket.id}</span>
              {isCompleted ? (
                <span className="ml-3 px-3 py-1 bg-gray-600 text-white text-sm rounded">
                  Đã hoàn thành
                </span>
              ) : (
                <span className="ml-3 px-3 py-1 bg-green-600 text-white text-sm rounded">
                  Đã nhận sách
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
                <p className="text-sm text-gray-500">Ngày mượn</p>
                <p className="font-medium">{ticket.expirationDate ? "15/05/2024" : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hạn trả</p>
                <p className="font-medium">{ticket.expirationDate || "30/05/2024"}</p>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Danh sách sách cần trả
              </h3>
              <div className="text-sm text-gray-600">
                Tổng: {totalBooks} bản • {isCompleted ? "Đã hoàn thành" : `Đã trả: ${returnedCount}/${totalBooks}`}
              </div>
            </div>

            {/* TABLE HEADER với cột Tình trạng và Hành động */}
            <div className="grid grid-cols-[100px_2fr_1fr_1fr_100px_140px_140px] bg-[#7A4A2E] text-white px-4 py-3 rounded-t">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>Tác giả</div>
              <div>ID sách</div>
              <div className="text-center">Bản số</div>
              <div className="text-center">Tình trạng</div>
              <div className="text-center">Hành động</div>
            </div>

            {/* TABLE BODY */}
            <div className="max-h-[40vh] overflow-y-auto border border-t-0 rounded-b bg-white">
              {books.map((book, index) => {
                const statusInfo = getStatusInfo(book.status);
                const bookNumber = parseInt(book.id.split('_').pop());
                const isReturned = book.status === "returned";
                
                return (
                  <div
                    key={book.id}
                    className="grid grid-cols-[100px_2fr_1fr_1fr_100px_140px_140px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
                  >
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-14 h-20 object-cover rounded shadow"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100x140?text=No+Image";
                      }}
                    />

                    <div>
                      <div className="font-medium text-gray-800">{book.name}</div>
                      <div className="text-sm text-gray-500">{book.category}</div>
                    </div>

                    <div className="text-gray-700">{book.author}</div>

                    <div className="font-mono text-[#7A4A2E] font-medium">
                      {book.bookId}
                    </div>

                    <div className="font-semibold text-center">
                      {bookNumber}
                    </div>

                    {/* Cột Tình trạng - CHỈ HIỂN THỊ "Đã trả" ở đây */}
                    <div className="text-center">
                      {statusInfo.text && (
                        <span className={`px-3 py-1 text-xs rounded-full ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      )}
                    </div>

                    {/* Cột Hành động - CHỈ HIỂN THỊ NÚT KHI CHƯA TRẢ VÀ TICKET CHƯA COMPLETED */}
                    <div className="text-center">
                      {!isCompleted && !isReturned ? (
                        <button
                          onClick={() => handleReturnBook(book.id)}
                          className="px-4 py-2 text-white rounded text-sm transition hover:opacity-90"
                          style={{ backgroundColor: "#7A4A2E" }}
                        >
                          Duyệt đã trả
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary - CHỈ HIỂN THỊ KHI TICKET CHƯA COMPLETED */}
            {!isCompleted && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-blue-600">Tổng số bản</div>
                    <div className="text-xl font-bold text-blue-800">{totalBooks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600">Đã trả</div>
                    <div className="text-xl font-bold text-green-800">{returnedCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-yellow-600">Chờ trả</div>
                    <div className="text-xl font-bold text-yellow-800">{totalBooks - returnedCount}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER - ACTION BUTTONS */}
        <div className="border-t border-gray-300 p-6 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <span className="font-medium">Tổng số bản: {totalBooks}</span>
              {!isCompleted && (
                <>
                  <span className="mx-2">•</span>
                  <span>Đã trả: {returnedCount}</span>
                  <span className="mx-2">•</span>
                  <span>Chờ trả: {totalBooks - returnedCount}</span>
                </>
              )}
            </div>
            
            <div className="flex gap-4">
              {/* Nếu ticket đã completed, chỉ hiển thị thông báo */}
              {isCompleted ? (
                <div className="px-8 py-4 bg-gray-600 text-white rounded-lg font-medium text-center min-w-[140px]">
                  Đã hoàn thành
                </div>
              ) : (
                <>
                  <button
                    onClick={handleWarn}
                    className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition text-base"
                    style={{ backgroundColor: "#FF8B37", minWidth: "120px" }}
                  >
                    Cảnh báo
                  </button>
                  <button
                    onClick={handleConfirmAll}
                    className="px-8 py-4 text-white rounded-lg font-medium hover:opacity-90 transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#7A4A2E", minWidth: "140px" }}
                    disabled={returnedCount === 0}
                  >
                    Xác nhận ({returnedCount})
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