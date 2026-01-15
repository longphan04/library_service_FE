import BookCard from "../components/Bookcard";

export default function BookManagement() {
  return (
    <div className="bg-bg min-h-screen px-6 py-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <select className="px-3 py-2 rounded border border-primary text-primary">
          <option>Thể loại</option>
        </select>

        <div className="flex gap-2">
          <button className="bg-primary text-white px-4 py-2 rounded">
            + Thêm sách
          </button>
          <button className="bg-danger text-white px-4 py-2 rounded">
            🗑 Xóa sách
          </button>
        </div>
      </div>

      {/* Grid sách */}
      <div className="grid grid-cols-3 gap-">
        {Array.from({ length: 9 }).map((_, i) => (
          <BookCard key={i} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button>‹</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>›</button>
      </div>
    </div>
  );
}
