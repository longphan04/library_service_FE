import ReceiveRowActions from "./ReceiveRowActions";

export default function ReceiveTicketRow({ 
  ticket, 
  onToggleOne, 
  onConfirmOne,
  onViewTicket
}) {
  const { id, userName, email, cardId, quantity, status, checked, expirationDate } = ticket;
  
  // Ngăn sự kiện click lan truyền để checkbox và các nút hành động hoạt động độc lập
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
      className="grid grid-cols-[40px_2fr_2fr_1fr_1fr_1fr_250px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition cursor-pointer"
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

      <div className="font-medium text-gray-800">{userName}</div>
      <div className="text-gray-600 pl-6">{email}</div>
      <div className="text-gray-600 font-mono">{cardId}</div>
      <div className="text-gray-800 font-semibold">{quantity}</div>
      <div className="text-gray-800 font-medium">{expirationDate || "N/A"}</div>

      {/* Container cho các nút hành động - cần stopPropagation */}
      <div 
        className="flex justify-end gap-3 actions-container"
        onClick={(e) => e.stopPropagation()}
      >
        <ReceiveRowActions 
          ticket={ticket} 
          onConfirmOne={onConfirmOne}
        />
      </div>
    </div>
  );
}