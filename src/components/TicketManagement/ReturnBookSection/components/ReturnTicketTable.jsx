import ReturnTableHeader from "./ReturnTableHeader";
import ReturnTicketRow from "./ReturnTicketRow";

export default function ReturnTicketTable({
  tickets,
  allChecked,
  onToggleAll,
  onToggleOne,
  onConfirmOne,
  onWarnOne,
}) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
        <div className="text-xl mb-2">📭</div>
        <p className="text-lg">Không có sách đã trả</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ReturnTableHeader 
        allChecked={allChecked} 
        onToggleAll={onToggleAll}
      />
      
      <div className="divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <ReturnTicketRow
            key={ticket.id}
            ticket={ticket}
            onToggleOne={onToggleOne}
            onConfirmOne={onConfirmOne}
            onWarnOne={onWarnOne}
          />
        ))}
      </div>
    </div>
  );
}