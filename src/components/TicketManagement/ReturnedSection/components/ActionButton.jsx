export default function ActionButton({
    onConfirm,
    confirmLabel = "Xác nhận",
    disabled = false
}) {
    return (
        <div className="flex gap-4">
            <button
                onClick={onConfirm}
                disabled={disabled}
                className="px-6 py-3 rounded text-white font-medium transition hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "#7A4A2E" }}
            >
                {confirmLabel}
            </button>
        </div>
    );
}
