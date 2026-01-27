import CancelledTableHeader from "./CancelledTableHeader";
import CancelledTicketRow from "./CancelledTicketRow";

export default function CancelledTicketTable({
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
    <div className="rounded-lg overflow-hidden">
      <CancelledTableHeader
        allChecked={allChecked}
        onToggleAll={onToggleAll}
      />

      <div className="divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <CancelledTicketRow
            key={ticket.id}
            ticket={ticket}
            onToggleOne={onToggleOne}
            onConfirmOne={onConfirmOne}
            onViewTicket={onViewTicket}
          />
        ))}
      </div>
    </div>
  );
}