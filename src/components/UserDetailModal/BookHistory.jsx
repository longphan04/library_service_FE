import BookHistoryCard from "./BookHistoryCard";

export default function BookHistory({ histories = [], onSendWarning }) {
    return (
        <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-xl text-primary mb-6">
                📚 Lịch sử mượn sách
            </h3>

            {histories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Người dùng chưa có lịch sử mượn sách
                </div>
            ) : (
                <div className="space-y-5">
                    {histories.map((history) => (
                        <BookHistoryCard
                            key={history.ticket_id}
                            history={history}
                            onSendWarning={onSendWarning}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}