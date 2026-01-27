export default function ActionButtons({
  onConfirm,
  onReject,
  confirmLabel = "Xác nhận",
  showReject = true,
  disabled = false
}) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onConfirm}
        disabled={disabled}
        className="px-6 py-3 rounded text-white font-medium transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
        style={{ backgroundColor: "#7A4A2E" }}
      >
        {confirmLabel}
      </button>

      {showReject && (
        <button
          onClick={onReject}
          disabled={disabled}
          className="px-6 py-3 rounded text-white font-medium transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
          style={{ backgroundColor: "#DE6767" }}
        >
          Từ chối
        </button>
      )}
    </div>
  );
}