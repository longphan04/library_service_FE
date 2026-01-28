import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { FALLBACK_IMAGES } from "@/utils/imageUrl";

export default function TicketDetailModal({
  open,
  onClose,
  ticket,
  onConfirm,
  onReject,
}) {
  const [books, setBooks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", onConfirm: () => { } });
  const [showReject, setShowReject] = useState(false);

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
      setUserInfo(ticket.userInfo);
      setBooks(ticket.books);
    } else {
      setUserInfo(null);
      setBooks([]);
    }
  }, [open, ticket]);

  // Nếu modal không mở, return null SAU KHI đã khai báo tất cả hooks
  if (!open || !ticket) return null;

  // Xử lý xác nhận toàn bộ ticket
  const handleConfirm = () => {
    setConfirmConfig({
      title: "Bạn có chắc chắn muốn duyệt phiếu mượn này?",
      onConfirm: () => {
        if (onConfirm) {
          onConfirm(ticket.id, books);
        }
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  // Xử lý từ chối toàn bộ ticket
  const handleReject = () => {
    setConfirmConfig({
      title: "Bạn có chắc chắn muốn từ chối phiếu mượn này?",
      onConfirm: () => {
        if (onReject) {
          onReject(ticket.id);
        }
        setShowReject(false);
      }
    });
    setShowReject(true);
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
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{userInfo?.phone}</p>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Danh sách sách yêu cầu mượn
            </h3>

            {/* TABLE HEADER - Không có checkbox */}
            <div className="grid grid-cols-[100px_2fr_1fr_100px] bg-[#7A4A2E] text-white px-4 py-3 rounded-t">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>ID sách</div>
              <div>Số lượng</div>
            </div>

            {/* TABLE BODY - Không có checkbox */}
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
                    className="px-8 py-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-base cursor-pointer"
                    style={{ backgroundColor: "#DE6767", minWidth: "120px" }}
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-8 py-4 text-white rounded-lg font-medium hover:opacity-90 transition text-base cursor-pointer"
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

      <ConfirmModal
        open={showConfirm}
        title={confirmConfig.title}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmModal
        open={showReject}
        title={confirmConfig.title}
        confirmVariant="danger"
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setShowReject(false)}
      />
    </div>
  );
}