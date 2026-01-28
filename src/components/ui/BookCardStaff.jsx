import { IMAGE_BASE_URL } from '@/config/constants';
import { FALLBACK_IMAGES, getBookCoverUrl } from '../../utils/imageUrl';

export default function BookCard({ book, isChecked, onCheckChange, onEdit }) {
  return (
    <div className="w-full min-h-[320px] h-full">
      <div className="bg-white rounded-lg p-6 shadow-sm flex items-start gap-6 w-full h-full border border-gray-100 hover:shadow-md transition-shadow relative">
        {/* Thumbnail */}
        <div className="w-[120px] h-[180px] flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden border border-gray-100">
          <img
            src={
              book.cover_url
                ? `${IMAGE_BASE_URL}/${book.cover_url}`
                : FALLBACK_IMAGES.book
            }
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGES.book;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div>
            <h3
              className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 leading-tight overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                height: '2.8rem', // Fixed height for 2 lines
              }}
              title={book.title}
            >
              {book.title}
            </h3>

            <div className="space-y-1 mt-1">
              <p className="text-sm text-gray-600 truncate" title={book.authors?.map(a => a.name).join(", ")}>
                <span className="font-medium text-gray-700">Tác giả:</span> {book.authors?.map(a => a.name).join(", ")}
              </p>
              <p className="text-sm text-gray-600 truncate" title={book.publisher?.name}>
                <span className="font-medium text-gray-700">NXB:</span> {book.publisher?.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Năm:</span> {book.publish_year}
              </p>
              <p className="text-sm font-semibold text-[#7A4A2E]">
                Số lượng: {book.available_copies}
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-4 overflow-hidden" style={{ height: '25px' }}>
              {book.categories?.slice(0, 3).map((cat) => (
                <span
                  key={cat.category_id}
                  className="px-3 py-1 rounded-full text-white text-[10px] font-semibold whitespace-nowrap"
                  style={{ backgroundColor: '#7A4A2E' }}
                >
                  {cat.name}
                </span>
              ))}
              {book.categories?.length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{book.categories.length - 3}</span>
              )}
            </div>
          </div>

          {/* Footer Actions (Checkbox & Edit Button) */}
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-4">
            <div className="flex-shrink-0 flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onCheckChange(book.book_id, e.target.checked)}
                className="w-5 h-5 cursor-pointer"
                style={{ accentColor: '#7A4A2E' }}
                id={`check-${book.book_id}`}
              />
              <label htmlFor={`check-${book.book_id}`} className="text-xs text-gray-500 cursor-pointer whitespace-nowrap">Chọn xóa</label>
            </div>

            <button
              className="flex-1 py-2.5 rounded bg-[#7A4A2E] text-white text-sm font-semibold hover:bg-[#633c25] transition-colors shadow-sm cursor-pointer"
              onClick={() => onEdit && onEdit(book.book_id)}
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}