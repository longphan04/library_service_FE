import ReceiveTableHeader from "./ReceiveTableHeader";
import ReceiveTicketRow from "./ReceiveTicketRow";

export default function ReceiveTicketTable({
  tickets,
  allChecked,
  onToggleAll,
  onToggleOne,
  onConfirmOne,
  onViewTicket, // Thêm prop mới
}) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
        <div className="text-xl mb-2">📭</div>
        <p className="text-lg">Không có sách đang chờ nhận</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ReceiveTableHeader 
        allChecked={allChecked} 
        onToggleAll={onToggleAll}
      />
      
      <div className="divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <ReceiveTicketRow
            key={ticket.id}
            ticket={ticket}
            onToggleOne={onToggleOne}
            onConfirmOne={onConfirmOne}
            onViewTicket={onViewTicket} // Truyền prop xuống
          />
        ))}
      </div>
    </div>
  );
}