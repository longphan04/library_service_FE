export default function CancelledRowActions({
  ticket,
  onConfirmOne
}) {
  const { status, id } = ticket;

  if (status?.toUpperCase() === "APPROVED") {
    return (
      <button
        onClick={() => onConfirmOne(id)}
        className="px-6 py-3 rounded text-white text-base transition hover:opacity-90"
        style={{ backgroundColor: "#7A4A2E", minWidth: "100px" }}
      >
        Xác nhận
      </button>
    );
  }

  return null;
}