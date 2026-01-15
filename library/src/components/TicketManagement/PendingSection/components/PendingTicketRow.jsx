import PendingRowActions from "./PendingRowActions";

export default function PendingTicketRow({ 
  ticket, 
  onToggleOne, 
  onConfirmOne, 
  onRejectOne,
  onViewTicket
}) {
  const { id, userName, email, cardId, quantity, status, checked } = ticket;
  
  return (
    <div className="grid grid-cols-[40px_2fr_2fr_1fr_1fr_250px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition">
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

      <div className="flex justify-end gap-3">
        {/* Nút "..." thay vì "Chi tiết" */}
        <span
          onClick={() => onViewTicket && onViewTicket(ticket)}
          className="px-5 py-2.5 text-gray-700 rounded text-base flex items-center justify-center cursor-pointer"
        >
          ⋯
        </span>
        
        <PendingRowActions 
          ticket={ticket} 
          onConfirmOne={onConfirmOne}
          onRejectOne={onRejectOne}
        />
      </div>
    </div>
  );
}