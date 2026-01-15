import PendingTableHeader from "./PendingTableHeader";
import PendingTicketRow from "./PendingTicketRow";

export default function PendingTicketTable({
  tickets,
  allChecked,
  onToggleAll,
  onToggleOne,
  onConfirmOne,
  onRejectOne,
}) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
        <div className="text-xl mb-2">📭</div>
        <p className="text-lg">Không có yêu cầu mượn sách nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <PendingTableHeader 
        allChecked={allChecked} 
        onToggleAll={onToggleAll}
      />
      
      <div className="divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <PendingTicketRow
            key={ticket.id}
            ticket={ticket}
            onToggleOne={onToggleOne}
            onConfirmOne={onConfirmOne}
            onRejectOne={onRejectOne}
          />
        ))}
      </div>
    </div>
  );
}