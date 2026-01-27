export default function ReturnedTableHeader({
    allChecked,
    onToggleAll
}) {
    return (
        <div
            className="grid grid-cols-[1fr_1fr_1fr_150px_400px] text-white px-4 py-4 rounded-t-lg"
            style={{ backgroundColor: "#7A4A2E" }}
        >
            <div className="font-medium text-center">ID thẻ</div>
            <div className="font-medium">Người trả</div>
            <div className="font-medium text-center">Ngày nhận</div>
            <div className="font-medium text-center">Hạn trả</div>
            <div className="font-medium text-center">Trạng thái</div>
        </div>
    );
}
