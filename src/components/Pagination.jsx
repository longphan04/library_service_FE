export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      <button 
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded transition-colors disabled:opacity-50"
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded font-medium transition-colors ${
            currentPage === page 
              ? 'text-white' 
              : 'hover:bg-white'
          }`}
          style={currentPage === page ? { backgroundColor: '#7A4A2E' } : {}}
        >
          {page}
        </button>
      ))}
      
      {totalPages > 3 && (
        <>
          <span className="w-10 h-10 flex items-center justify-center">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button 
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded transition-colors disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
}