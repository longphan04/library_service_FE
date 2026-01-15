export default function ReturnRowActions({ 
  ticket, 
  onConfirmOne,
  onWarnOne
}) {
  const { status, id } = ticket;
  
  if (status === "received") {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => onConfirmOne(id)}
          className="px-6 py-3 rounded text-white text-base transition hover:opacity-90"
          style={{ backgroundColor: "#7A4A2E", minWidth: "100px" }}
        >
          Xác nhận
        </button>
        <button
          onClick={() => onWarnOne && onWarnOne(id)}
          className="px-6 py-3 rounded text-white text-base transition hover:opacity-90"
          style={{ backgroundColor: "#FF8B37", minWidth: "100px" }}
        >
          Cảnh báo
        </button>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <span 
        className="px-6 py-3 rounded text-white text-base text-center"
        style={{ backgroundColor: "#6B7280", minWidth: "120px" }}
      >
        Đã hoàn thành
      </span>
    );
  }

  return null;
}