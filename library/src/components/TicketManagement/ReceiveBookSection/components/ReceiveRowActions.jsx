export default function ReceiveRowActions({ 
  ticket, 
  onConfirmOne 
}) {
  const { status, id } = ticket;
  
  if (status === "waiting_pickup") {
    return (
      <button
        onClick={() => onConfirmOne(id)}
        className="px-4 py-2 rounded text-white text-sm transition hover:opacity-90"
        style={{ backgroundColor: "#7A4A2E" }}
      >
        Xác nhận
      </button>
    );
  }

  return null;
}