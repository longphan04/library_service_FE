import ReturnedTableHeader from "./ReturnedTableHeader";
import ReturnedTicketRow from "./ReturnedTicketRow";

export default function ReturnedTicketTable({
    tickets,
    allChecked,
    onToggleAll,
    onToggleOne,
    onViewTicket,
}) {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                <div className="text-xl mb-2">📭</div>
                <p className="text-lg">Không có phiếu mượn nào đã trả</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden">
            <ReturnedTableHeader
                allChecked={allChecked}
                onToggleAll={onToggleAll}
            />

            <div className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                    <ReturnedTicketRow
                        key={ticket.id}
                        ticket={ticket}
                        onToggleOne={onToggleOne}
                        onViewTicket={onViewTicket}
                    />
                ))}
            </div>
        </div>
    );
}
