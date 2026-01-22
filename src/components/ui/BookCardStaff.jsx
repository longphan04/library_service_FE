import { FALLBACK_IMAGES } from '../../utils/imageUrl';

export default function BookCard({ book, isChecked, onCheckChange, onEdit }) {
  return (
    <div className="max-w-full">
      <div className="bg-white rounded-lg p-6 shadow-sm flex items-start gap-6 w-full">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheckChange(book.id, e.target.checked)}
          className="mt-2 w-5 h-5"
          style={{ accentColor: '#7A4A2E' }}
        />

        <img
          src={
            book.cover
              ? `https://bd4328e96c81.ngrok-free.app/book${book.cover}`
              : FALLBACK_IMAGES.book
          }
          alt={book.title}
        />


        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-1">{book.author}</p>
          <p className="text-sm text-gray-600 mb-1">{book.publisher}</p>
          <p className="text-sm text-gray-600 mb-1">{book.availability}</p>
          <p className="text-sm text-gray-600 mb-4">{book.year}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {book.tags && book.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-1.5 rounded-full text-white text-xs font-medium"
                style={{ backgroundColor: '#7A4A2E' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          className="px-6 py-3 rounded text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ backgroundColor: '#7A4A2E' }}
          onClick={() => onEdit && onEdit(book.id)}
        >
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
}