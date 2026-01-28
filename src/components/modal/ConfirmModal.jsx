import Modal from "./Modal";
import ActionButton from "../ui/ActionButton";

export default function ConfirmModal({
    open,
    title,
    onConfirm,
    onCancel,
    confirmLabel = "Xác nhận",
    cancelLabel = "Hủy",
    confirmVariant = "success"
}) {
    return (
        <Modal open={open} title={title} onClose={onCancel}>
            <div className="flex gap-2 mt-4">
                <ActionButton
                    onClick={onConfirm}
                    variant={confirmVariant}
                    className="flex-1 justify-center h-10 rounded-full font-medium"
                >
                    {confirmLabel}
                </ActionButton>

                <ActionButton
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 justify-center h-10 rounded-full font-medium"
                >
                    {cancelLabel}
                </ActionButton>
            </div>
        </Modal>
    );
}
