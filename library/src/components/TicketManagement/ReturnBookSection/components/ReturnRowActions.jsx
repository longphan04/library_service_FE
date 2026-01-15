export default function ReturnRowActions({ 
  ticket, 
  onConfirmOne,
  onWarnOne
}) {
  const { status, id } = ticket;
  
  if (status === "received") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onConfirmOne(id)}
          className="px-4 py-2 rounded text-white text-sm transition hover:opacity-90"
          style={{ backgroundColor: "#7A4A2E" }}
        >
          Xác nhận
        </button>
        <button
          onClick={() => onWarnOne && onWarnOne(id)}
          className="px-4 py-2 rounded text-white text-sm transition hover:opacity-90"
          style={{ backgroundColor: "#FF8B37" }}
        >
          Cảnh báo
        </button>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <span 
        className="px-4 py-2 rounded text-white text-sm"
        style={{ backgroundColor: "#6B7280" }}
      >
        Đã hoàn thành
      </span>
    );
  }

  return null;
}