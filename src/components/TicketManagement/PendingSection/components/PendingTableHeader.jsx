export default function PendingTableHeader({
  allChecked,
  onToggleAll
}) {
  return (
    <div
      className="grid grid-cols-[40px_2fr_2fr_2fr_2fr_250px] text-white px-4 py-4 rounded-t-lg"
      style={{ backgroundColor: "#7A4A2E" }}
    >
      <input
        type="checkbox"
        checked={allChecked}
        onChange={(e) => onToggleAll(e.target.checked)}
        style={{ accentColor: '#494949' }}
        className="h-5 w-5 cursor-pointer"
      />
      <div className="font-medium">ID thẻ</div>
      <div className="font-medium">Tên người mượn</div>
      <div className="font-medium">Ngày yêu cầu</div>
      <div className="font-medium">Tình trạng</div>
      <div className="text-right">Hành động</div>
    </div>
  );
}