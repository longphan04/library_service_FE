import ReturnedRowAction from "./ReturnedRowAction";
import dayjs from "dayjs";

export default function ReturnedTicketRow({
    ticket,
    onToggleOne,
    onViewTicket
}) {
    const {
        id,
        userName,
        email,
        checked = false,
        pickedUpAt,
        dueDate,
    } = ticket;

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
            className="grid grid-cols-[1fr_1fr_1fr_150px_400px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition cursor-pointer"
            onClick={handleRowClick}
        >
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
                <span className={`px-3 py-1 text-xs rounded-full bg-green-500 text-white`}>
                    Đã trả
                </span>
            </div>

            <div
                className="flex justify-end gap-3 actions-container"
                onClick={(e) => e.stopPropagation()}
            >
                <ReturnedRowAction
                    ticket={ticket}
                    onViewTicket={onViewTicket}
                />
            </div>
        </div>
    );
}
