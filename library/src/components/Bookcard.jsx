import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function BookCard() {
  const [available, setAvailable] = useState(3);

  return (
    <div className="bg-white rounded-xl p-4 flex gap-4">
      <img
        src="https://covers.openlibrary.org/b/id/7984916-L.jpg"
        className="w-20 h-28 rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold">Harry Potter ...</h3>
        <p className="text-sm text-gray-500">Tác giả</p>
        <p className="text-sm text-gray-500">Ngày xuất bản: ...</p>

        {/* Số lượng */}
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <span>Có sẵn: {available} trên 10</span>
          <div className="flex flex-col">
            <button onClick={() => setAvailable(a => Math.min(a + 1, 10))}>
              <ChevronUp size={14} />
            </button>
            <button onClick={() => setAvailable(a => Math.max(a - 1, 0))}>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Thể loại */}
        <div className="flex gap-2 mt-2">
          {["Kỹ ảo", "Tiểu thuyết"].map(t => (
            <span
              key={t}
              className="px-2 py-1 bg-primary text-white text-xs rounded"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <input type="checkbox" />
        <button className="bg-primary text-white px-3 py-1 rounded text-sm">
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
}
