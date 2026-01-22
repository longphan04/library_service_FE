import BookHistoryCard from "./BookHistoryCard";
import { mockHistories } from "./mockHistories";

export default function BookHistory({ onSendWarning }) {
    return (
        <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-xl text-primary mb-6">
                📚 Lịch sử mượn sách
            </h3>

            <div className="space-y-5">
                {mockHistories.map((history) => (
                    <BookHistoryCard
                        key={history.id}
                        history={history}
                        onSendWarning={onSendWarning}
                    />
                ))}
            </div>
        </div>
    );
}