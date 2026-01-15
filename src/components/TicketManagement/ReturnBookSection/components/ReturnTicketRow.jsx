import ReturnRowActions from "./ReturnRowActions";

export default function ReturnTicketRow({ 
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
    if (status === "completed") {
      return { text: "Đã hoàn thành", color: "bg-gray-600 text-white" };
    }
    if (isOverdue) {
      return { text: "Quá hạn", color: "bg-red-500 text-white" };
    }
    if (returnedCount > 0 && returnedCount < quantity) {
      return { text: "Đang trả", color: "bg-yellow-500 text-white" };
    }
    return { text: "Chờ trả", color: "bg-blue-500 text-white" };
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

  return (
    <div className="grid grid-cols-[40px_2fr_2fr_1fr_1fr_1fr_120px_250px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition">
      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) => onToggleOne(id, e.target.checked)}
        style={{ accentColor: '#7A4A2E' }}
        className="h-5 w-5"
      />

      <div className="font-medium text-gray-800">{userName}</div>
      <div className="text-gray-600 pl-6">{email}</div>
      <div className="text-gray-600 font-mono">{cardId}</div>
      
      {/* Cột Số lượng - Hiển thị tỷ lệ đã trả */}
      <div className="text-center">
        <div className="font-semibold text-gray-800">{returnRatio}</div>
        <div className="text-xs text-gray-500 mt-1">
          {quantity} sách • {returnedCount} đã trả
        </div>
      </div>
      
      <div className="text-gray-800 font-medium">{expirationDate || "N/A"}</div>
      
      {/* Cột Tình trạng ticket */}
      <div className="text-center">
        <span className={`px-3 py-1 text-xs rounded-full ${ticketStatus.color}`}>
          {ticketStatus.text}
        </span>
      </div>

      <div className="flex justify-end gap-3">
        {/* Nút "..." */}
        <button
          onClick={() => onViewTicket && onViewTicket(ticket)}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded text-base hover:bg-gray-300 transition flex items-center gap-1 min-w-[100px] justify-center"
        >
          ⋯
        </button>
        
        <ReturnRowActions 
          ticket={ticket} 
          onConfirmOne={onConfirmOne}
          onWarnOne={onWarnOne}
        />
      </div>
    </div>
  );
}