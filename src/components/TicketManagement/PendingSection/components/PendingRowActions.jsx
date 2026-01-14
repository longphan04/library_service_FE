export default function PendingRowActions({ 
  ticket, 
  onConfirmOne, 
  onRejectOne 
}) {
  const { status, id } = ticket;
  
  if (status === "rejected") {
    return (
      <span 
        className="px-4 py-2 rounded text-white text-sm"
        style={{ backgroundColor: "#000000" }}
      >
        Đã từ chối
      </span>
    );
  }

  if (status === "pending") {
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
          onClick={() => onRejectOne(id)}
          className="px-4 py-2 rounded text-white text-sm transition hover:opacity-90"
          style={{ backgroundColor: "#DE6767" }}
        >
          Từ chối
        </button>
      </div>
    );
  }

  return null;
}