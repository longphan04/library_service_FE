export default function PendingRowActions({
  ticket,
  onConfirmOne,
  onRejectOne
}) {
  const { status, id } = ticket;

  if (status === "rejected") {
    return (
      <span
        className="px-6 py-3 rounded text-white text-base"
        style={{ backgroundColor: "#000000", minWidth: "120px", textAlign: "center" }}
      >
        Đã từ chối
      </span>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => onConfirmOne(id)}
          className="px-6 py-3 rounded text-white transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#7A4A2E", minWidth: "110px" }}
        >
          Xác nhận
        </button>
        <button
          onClick={() => onRejectOne(id)}
          className="px-6 py-3 rounded text-black transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#DE6767", minWidth: "100px" }}
        >
          Từ chối
        </button>
      </div>
    );
  }

  return null;
}