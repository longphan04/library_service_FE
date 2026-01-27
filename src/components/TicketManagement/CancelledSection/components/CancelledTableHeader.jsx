export default function CancelledTableHeader({
  allChecked,
  onToggleAll
}) {
  return (
    <div
      className="grid grid-cols-[100px_1fr_1fr_1fr_250px] text-white px-4 py-4 items-center rounded-t-lg"
      style={{ backgroundColor: "#7A4A2E" }}
    >
      <input
        type="checkbox"
        checked={allChecked}
        onChange={(e) => onToggleAll(e.target.checked)}
        style={{ accentColor: '#494949' }}
        className="h-5 w-5"
      />
      <div className="font-medium">ID thẻ</div>
      <div className="font-medium">Người mượn</div>
      <div className="font-medium">Ngày yêu cầu</div>
      <div className="text-right">Hành động</div>
    </div>
  );
}