import PickedUpRowAction from "./PickedUpRowAction";
import dayjs from "dayjs";

export default function PickedUpTicketRow({
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
        status,
        checked = false,
        pickedUpAt,
        dueDate,
        isOverdue = false
    } = ticket;

    // Xác định trạng thái ticket
    const getTicketStatus = () => {
        if (isOverdue) {
            return { text: "Quá hạn", color: "bg-red-400 text-white" };
        }
        return { text: "Đang mượn", color: "bg-blue-400 text-white" };
    };

    const ticketStatus = getTicketStatus();

    const handleRowClick = (e) => {
        if (
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'BUTTON' ||
            e.target.closest('.actions-container') ||
            e.target.closest('button')
        ) {
            return;
        }
        if (typeof onViewTicket === 'function' && ticket) {
            onViewTicket(ticket);
        }
    };

    return (
        <div
            className="grid grid-cols-[40px_2fr_1.5fr_1.5fr_1.5fr_120px_280px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition cursor-pointer"
            onClick={handleRowClick}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={checked || false}
                    onChange={(e) => onToggleOne(id, e.target.checked)}
                    style={{ accentColor: '#7A4A2E' }}
                    className="h-5 w-5 cursor-pointer"
                />
            </div>

            <div className="text-gray-600 font-mono text-center">{id}</div>
            <div className="font-medium text-gray-800">
                <div>{userName}</div>
                <div className="text-xs text-gray-500 font-normal">{email}</div>
            </div>

            <div className="text-center text-gray-800 font-medium">
                {pickedUpAt ? dayjs(pickedUpAt).format("DD/MM/YYYY") : "—"}
            </div>

            <div className="text-center text-gray-800 font-medium">
                {dueDate ? dayjs(dueDate).format("DD/MM/YYYY") : "—"}
            </div>

            <div className="text-center">
                <span className={`px-3 py-1 text-xs rounded-full ${ticketStatus.color}`}>
                    {ticketStatus.text}
                </span>
            </div>

            <div
                className="flex justify-end gap-3 actions-container"
                onClick={(e) => e.stopPropagation()}
            >
                <PickedUpRowAction
                    ticket={ticket}
                    onConfirmOne={onConfirmOne}
                    onWarnOne={onWarnOne}
                    onViewTicket={onViewTicket}
                />
            </div>
        </div>
    );
}
