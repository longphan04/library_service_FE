import Modal from "./Modal";
import ActionButton from "../ui/ActionButton";

export default function FormModal({
    open,
    onClose,
    title,
    onSubmit,
    children,
    submitText = "Xác nhận",
    cancelText = "Hủy",
}) {
    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-xl font-semibold text-center mb-6">
                {title}
            </h2>

            <div className="space-y-4">{children}</div>

            <div className="flex gap-6 mt-8">
                <ActionButton
                    variant="success"
                    className="flex-1 justify-center"
                    onClick={onSubmit}
                >
                    {submitText}
                </ActionButton>

                <ActionButton
                    variant="primary"
                    className="flex-1 justify-center"
                    onClick={onClose}
                >
                    {cancelText}
                </ActionButton>
            </div>
        </Modal>
    );
}
