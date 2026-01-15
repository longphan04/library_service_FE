import ReturnRowActions from "./ReturnRowActions";

export default function ReturnTicketRow({ 
  ticket, 
  onToggleOne, 
  onConfirmOne,
  onWarnOne,
  onViewTicket
}) {
  const { id, userName, email, cardId, quantity, status, checked, expirationDate } = ticket;
  
  return (
    <div className="grid grid-cols-[40px_2fr_2fr_1fr_1fr_1fr_250px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition">
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
      <div className="text-gray-800 font-semibold">{quantity}</div>
      <div className="text-gray-800 font-medium">{expirationDate || "N/A"}</div>

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