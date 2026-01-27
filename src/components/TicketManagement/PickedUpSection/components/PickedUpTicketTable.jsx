import PickedUpTableHeader from "./PickedUpTableHeader";
import PickedUpTicketRow from "./PickedUpTicketRow";

export default function PickedUpTicketTable({
    tickets,
    allChecked,
    onToggleAll,
    onToggleOne,
    onConfirmOne,
    onWarnOne,
    onViewTicket,
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
        <div className="rounded-lg overflow-hidden">
            <PickedUpTableHeader
                allChecked={allChecked}
                onToggleAll={onToggleAll}
            />

            <div className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                    <PickedUpTicketRow
                        key={ticket.id}
                        ticket={ticket}
                        onToggleOne={onToggleOne}
                        onConfirmOne={onConfirmOne}
                        onWarnOne={onWarnOne}
                        onViewTicket={onViewTicket}
                    />
                ))}
            </div>
        </div>
    );
}
