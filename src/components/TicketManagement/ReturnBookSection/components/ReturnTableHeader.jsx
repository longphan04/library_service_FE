export default function ReturnTableHeader({ 
  allChecked, 
  onToggleAll 
}) {
  return (
    <div 
      className="grid grid-cols-[40px_2fr_2fr_1fr_1fr_1fr_250px] text-white px-4 py-4 rounded-t-lg"
      style={{ backgroundColor: "#7A4A2E" }}
    >
      <input
        type="checkbox"
        checked={allChecked}
        onChange={(e) => onToggleAll(e.target.checked)}
        style={{ accentColor: '#494949' }}
        className="h-5 w-5"
      />
      <div className="font-medium">Người trả</div>
      <div className="font-medium pl-6">Email</div>
      <div className="font-medium">ID thẻ</div>
      <div className="font-medium">Số lượng</div>
      <div className="font-medium">Hết hạn</div>
      <div className="text-right">Hành động</div>
    </div>
  );
}