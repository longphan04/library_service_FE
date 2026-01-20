export default function BookItem({ book }) {
    return (
        <div className="bg-white rounded-xl p-4 flex gap-4 items-center border hover:bg-gray-50 transition-colors">
            {/* Hình ảnh sách */}
            <div className="flex-shrink-0">
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-200">
                    <img 
                        src={book.image} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='80' viewBox='0 0 64 80' fill='none'%3E%3Crect width='64' height='80' fill='%23E5E7EB'/%3E%3Ctext x='32' y='40' text-anchor='middle' dy='.3em' fill='%239CA3AF' font-size='12'%3E📚%3C/text%3E%3C/svg%3E";
                        }}
                    />
                </div>
            </div>

            {/* Thông tin sách */}
            <div className="flex-1">
                <div className="font-medium text-lg mb-1">{book.title}</div>
                <div className="flex flex-wrap gap-4">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Tác giả:</span> {book.author}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Mã sách:</span> #{book.id}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">ISBN:</span> {book.isbn}
                    </div>
                </div>
            </div>

            {/* Trạng thái trả sách */}
            <span
                className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 ${
                    book.returned
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                }`}
            >
                {book.returned ? "✅ Đã trả" : "❌ Chưa trả"}
            </span>
        </div>
    );
}