export default function ApprovedRowActions({
  ticket,
  onConfirmOne,
  onWarnOne
}) {
  const { status, id } = ticket;

  if (status === "approved") {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => onConfirmOne(id)}
          className="px-1 py-1 rounded text-white text-base transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#7A4A2E", minWidth: "110px" }}
        >
          Xác nhận
        </button>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <span
        className="px-1 py-1 rounded text-white text-base text-center"
        style={{ backgroundColor: "#4ADE80", minWidth: "120px" }}
      >
        Hoàn thành
      </span>
    );
  }

  return null;
}