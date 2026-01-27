import { CheckCircle } from "lucide-react";

export default function PickedUpRowAction({
    ticket,
    onConfirmOne,
    onWarnOne,
}) {
    return (
        <>
            <button
                onClick={() => onConfirmOne(ticket.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-md transition cursor-pointer"
                title="Xác nhận trả sách"
            >
                <CheckCircle size={18} />
                <span>Trả sách</span>
            </button>
        </>
    );
}
