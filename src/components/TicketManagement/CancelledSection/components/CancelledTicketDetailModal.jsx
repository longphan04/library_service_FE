import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FALLBACK_IMAGES } from '../../../../utils/imageUrl';
import { canceledTicketStaffService } from "@/services/canceledTicketStaff.service";
import dayjs from "dayjs";

export default function CancelledTicketDetailModal({
  open,
  onClose,
  ticket,
}) {
  const [books, setBooks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const handleClose = () => {
    setBooks([]);
    setUserInfo(null);
    onClose();
  };

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
      canceledTicketStaffService
        .getCanceledTicketDetail(ticket.id)
        .then(res => {
          if (!res) return;

          setUserInfo({
            name: res.member.name,
            email: res.member.email,
            cardId: res.member.cardId,
            phone: res.member.phone || "—",
          });

          setBooks(
            res.items.map(item => ({
              id: item.copyId,
              bookId: item.bookId,
              name: item.title,
              image: item.cover,
              copyNote: item.note,
              status: item.status,
              author: "—",
              category: "—",
              quantity: 1,
            }))
          );
        })
        .catch(err => {
          console.error("Load canceled ticket detail failed:", err);
          setBooks([]);
          setUserInfo(null);
        });
    } else {
      setBooks([]);
      setUserInfo(null);
    }
  }, [open, ticket]);

  if (!open || !ticket) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#F5EBE0" }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết phiếu hủy
            </h2>
            <p className="text-gray-600 mt-1">
              Mã phiếu: <span className="font-semibold text-[#7A4A2E]">{ticket.code || ticket.id}</span>
              <span className="ml-3 px-3 py-1 bg-red-100 text-red-800 text-sm rounded">
                Đã hủy
              </span>
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* User Info Section */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin người yêu cầu</h3>
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
                <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                <p className="font-medium">{ticket.requestedAt
                  ? dayjs(ticket.requestedAt).format("DD/MM/YYYY HH:mm")
                  : "-"}</p>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Danh sách sách
              </h3>
              <div className="text-sm text-gray-600">
                Tổng: {books.length} bản
              </div>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-[100px_2fr_1fr_1fr_120px] bg-[#7A4A2E] text-white px-4 py-3 rounded-t">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>Vị trí</div>
              <div>ID Bản</div>
              <div>Trạng thái</div>
            </div>

            {/* TABLE BODY */}
            <div className="max-h-[40vh] overflow-y-auto border border-t-0 rounded-b bg-white">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="grid grid-cols-[100px_2fr_1fr_1fr_120px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
                >
                  <img
                    src={book.image ? book.image : FALLBACK_IMAGES.book}
                    alt={book.name}
                    className="w-14 h-20 object-cover rounded shadow"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGES.book;
                    }}
                  />

                  <div>
                    <div className="font-medium text-gray-800">{book.name}</div>
                    <div className="text-sm text-gray-500">Book ID: {book.bookId}</div>
                  </div>

                  <div className="text-gray-700 font-mono font-semibold">{book.copyNote || "-"}</div>

                  <div className="font-mono text-[#7A4A2E] font-medium">
                    #{book.id}
                  </div>

                  <div className="text-sm">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                      Đã hủy
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-300 p-6 bg-white flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}