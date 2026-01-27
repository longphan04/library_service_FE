export default function ApprovedTableHeader({
  allChecked,
  onToggleAll
}) {
  return (
    <div
      className="grid grid-cols-[40px_2.5fr_1.2fr_1.5fr_120px_280px] text-white px-4 py-4 rounded-t-lg"
      style={{ backgroundColor: "#7A4A2E" }}
    >
      <input
        type="checkbox"
        checked={allChecked}
        onChange={(e) => onToggleAll(e.target.checked)}
        style={{ accentColor: '#494949' }}
        className="h-5 w-5 cursor-pointer"
      />
      <div className="font-medium text-center">ID thẻ</div>
      <div className="font-medium">Người trả</div>
      <div className="font-medium text-center">Hết hạn</div>
      <div className="font-medium text-center">Trạng thái</div>
      <div className="text-right">Hành động</div>
    </div>
  );
}