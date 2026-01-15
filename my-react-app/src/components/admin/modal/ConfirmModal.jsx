import Modal from "./Modal";

export default function ConfirmModal({
    open,
    title,
    onConfirm,
    onCancel,
}) {
    return (
        <Modal open={open} title={title} onClose={onCancel}>
            <div className="flex gap-6 mt-6">
                <button
                    onClick={onConfirm}
                    className="flex-1 h-10 bg-green-500 text-white
          rounded-full font-medium hover:bg-green-600"
                >
                    Xác nhận
                </button>

                <button
                    onClick={onCancel}
                    className="flex-1 h-10 bg-[#E2C6A6] text-[#7A4A2E]
          rounded-full font-medium hover:opacity-90"
                >
                    Hủy
                </button>
            </div>
        </Modal>
    );
}
