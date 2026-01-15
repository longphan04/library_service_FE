export default function ActionButtons({ 
  onConfirm, 
  onReject,
  confirmLabel = "Xác nhận",
  showReject = true 
}) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onConfirm}
        className="px-6 py-3 rounded text-white font-medium transition hover:opacity-90 disabled:opacity-40"
        style={{ backgroundColor: "#7A4A2E" }} // Màu cũ
      >
        {confirmLabel}
      </button>
      
      {showReject && (
        <button
          onClick={onReject}
          className="px-6 py-3 rounded text-white font-medium transition hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: "#DE6767" }}
        >
          Từ chối
        </button>
      )}
    </div>
  );
}