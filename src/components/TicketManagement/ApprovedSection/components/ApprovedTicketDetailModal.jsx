import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { FALLBACK_IMAGES } from '@/utils/imageUrl';

import { approvedTicketStaffService } from "@/services/approvedTicketStaff.service";

export default function ApprovedTicketDetailModal({
  open,
  onClose,
  ticket,
  onConfirm,
  onWarn,
  onUpdateApprovedCount,
}) {
  const [books, setBooks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", onConfirm: () => { } });

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
      console.log("Fetching detail for ticket:", ticket.id);

      // Reset state trước khi fetch
      setBooks([]);
      setUserInfo(null);

      approvedTicketStaffService.getTicketDetail(ticket.id)
        .then(data => {
          if (data) {
            setUserInfo({
              ...data.user,
              requestedAt: data.requestedAt,
              approvedAt: data.approvedAt,
              pickupExpiresAt: data.pickupExpiresAt
            });
            setBooks(data.books);
          }
        })
        .catch(err => console.error(err));
    }
  }, [open, ticket]);

  // Nếu modal không mở, return null SAU KHI đã khai báo tất cả hooks
  if (!open || !ticket) return null;

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
              Chi tiết phiếu nhận sách
            </h2>
            <p className="text-gray-600 mt-1">
              Mã phiếu: <span className="font-semibold text-[#7A4A2E]">{ticket.id}</span>
              {ticket.status === "completed" ? (
                <span className="ml-3 px-3 py-1 bg-gray-600 text-white text-sm rounded">
                  Đã hoàn thành
                </span>
              ) : (
                <span className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                  Đang chờ
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
                <p className="text-sm text-gray-500">Mã thẻ</p>
                <p className="font-medium">{userInfo?.cardId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{userInfo?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                <p className="font-medium">{userInfo?.requestedAt ? new Date(userInfo.requestedAt).toLocaleString("vi-VN") : "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày phê duyệt</p>
                <p className="font-medium">{userInfo?.approvedAt ? new Date(userInfo.approvedAt).toLocaleString("vi-VN") : "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hạn nhận sách</p>
                <p className="font-medium text-red-600 font-semibold">{userInfo?.pickupExpiresAt ? new Date(userInfo.pickupExpiresAt).toLocaleString("vi-VN") : "—"}</p>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Danh sách sách chờ nhận
              </h3>
              <div className="text-sm text-gray-600">
                Tổng: {books.length} bản
              </div>
            </div>

            {/* TABLE HEADER - Simplified */}
            <div className="grid grid-cols-[100px_2fr_1fr_100px] bg-[#7A4A2E] text-white px-4 py-3 rounded-t">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>ID sách</div>
              <div className="text-center">Bản số</div>
            </div>

            <div className="max-h-[40vh] overflow-y-auto border border-t-0 rounded-b bg-white">
              {books.map((book, index) => {
                const bookNumber = book.id;

                return (
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
                      <div className="text-sm text-gray-500">{book.category}</div>
                    </div>

                    <div className="font-mono text-[#7A4A2E] font-medium">
                      {book.bookId}
                    </div>

                    <div className="font-semibold text-center">
                      {bookNumber}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* FOOTER - ACTION BUTTONS */}
        <div className="border-t border-gray-300 p-6 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <span className="font-medium">Tổng số bản: {books.length}</span>
            </div>

            <div className="flex gap-4">
              {/* Nếu ticket đã completed, chỉ hiển thị thông báo */}
              {ticket.status === "completed" ? (
                <div className="px-8 py-4 bg-gray-600 text-white rounded-lg font-medium text-center min-w-[140px]">
                  Đã hoàn thành
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (ticket?.id) {
                        setConfirmConfig({
                          title: "Xác nhận khách hàng đã nhận sách cho phiếu này?",
                          onConfirm: () => {
                            onConfirm && onConfirm(ticket.id);
                            setShowConfirm(false);
                          }
                        });
                        setShowConfirm(true);
                      }
                    }}
                    className="px-8 py-4 text-white rounded-lg font-medium hover:opacity-90 transition text-base cursor-pointer"
                    style={{ backgroundColor: "#7A4A2E", minWidth: "140px" }}
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
    </div>
  );
}