import dayjs from "dayjs";

export default function CancelledTicketRow({
  ticket,
  onToggleOne,
  onConfirmOne,
  onViewTicket
}) {
  const { id,
    cardId,
    userName,
    requestedAt,
    status,
    checked } = ticket;

  // Ngăn sự kiện click lan truyền
  const handleRowClick = (e) => {
    if (e.target.tagName === 'INPUT') {
      return;
    }
    if (typeof onViewTicket === 'function' && ticket) {
      onViewTicket(ticket);
    }
  };

  return (
    <div
      className="grid grid-cols-[100px_1fr_1fr_1fr_250px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition cursor-pointer"
      onClick={handleRowClick}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={checked || false}
          onChange={(e) => onToggleOne(id, e.target.checked)}
          style={{ accentColor: '#7A4A2E' }}
          className="h-5 w-5 cursor-pointer"
        />
      </div>

      <div className="text-gray-600 font-mono">{id}</div>
      <div className="font-medium text-gray-800">{userName}</div>
      <div className="text-gray-800 font-medium">
        {requestedAt
          ? dayjs(requestedAt).format("DD/MM/YYYY HH:mm")
          : "—"}
      </div>

      <div className="text-right">
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Đã hủy
        </span>
      </div>
    </div>
  );
}