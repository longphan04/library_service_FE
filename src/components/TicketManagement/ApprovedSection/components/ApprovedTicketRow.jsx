import ApprovedRowActions from "./ApprovedRowActions";
import dayjs from "dayjs";

export default function ApprovedTicketRow({
  ticket,
  onToggleOne,
  onConfirmOne,
  onWarnOne,
  onViewTicket
}) {
  const {
    id,
    userName,
    email,
    cardId,
    quantity,
    returnedCount = 0,
    status,
    checked = false,
    expirationDate,
    isOverdue = false
  } = ticket;

  // Tính tỷ lệ sách đã trả
  const returnRatio = `${returnedCount}/${quantity}`;

  // Xác định trạng thái ticket
  const getTicketStatus = () => {
    if (status === "approved") {
      return { text: "Đang chờ", color: "bg-blue-400 text-white" };
    }
    return {};
  };

  const ticketStatus = getTicketStatus();

  const handleToggle = (e) => {
    if (typeof onToggleOne === 'function' && id) {
      onToggleOne(id, e.target.checked);
    }
  };

  const handleViewTicket = () => {
    if (typeof onViewTicket === 'function' && ticket) {
      onViewTicket(ticket);
    }
  };

  // Ngăn sự kiện click lan truyền để checkbox hoạt động độc lập
  const handleRowClick = (e) => {
    // Ngăn sự kiện click khi click vào checkbox, nút hành động hoặc các phần tử con khác
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'BUTTON' ||
      e.target.closest('.actions-container') ||
      e.target.closest('button')
    ) {
      return;
    }

    // Mở modal khi click vào các phần khác của hàng
    if (typeof onViewTicket === 'function' && ticket) {
      onViewTicket(ticket);
    }
  };

  return (
    <div
      className="grid grid-cols-[40px_2.5fr_1.2fr_1.5fr_120px_280px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition cursor-pointer"
      onClick={handleRowClick}
    >
      {/* Checkbox - cần stopPropagation để không mở modal khi click */}
      <div onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={checked || false}
          onChange={(e) => onToggleOne(id, e.target.checked)}
          style={{ accentColor: '#7A4A2E' }}
          className="h-5 w-5 cursor-pointer"
        />
      </div>

      <div className="text-gray-600 font-mono text-center">{id}</div>
      <div className="font-medium text-gray-800">{userName}</div>

      <div className="text-center text-gray-800 font-medium">
        {expirationDate ? dayjs(expirationDate).format("DD/MM/YYYY") : "—"}
      </div>

      {/* Cột Tình trạng ticket */}
      <div className="text-center">
        <span className={`px-3 py-1 text-xs rounded-full ${ticketStatus.color}`}>
          {ticketStatus.text}
        </span>
      </div>

      {/* Container cho các nút hành động - cần stopPropagation */}
      <div
        className="flex justify-end gap-3 actions-container"
        onClick={(e) => e.stopPropagation()}
      >
        <ApprovedRowActions
          ticket={ticket}
          onConfirmOne={onConfirmOne}
          onWarnOne={onWarnOne}
          onViewTicket={onViewTicket}
        />
      </div>
    </div>
  );
}