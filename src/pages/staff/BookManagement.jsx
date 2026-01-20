import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import BookCard from "@/components/ui/BookCardStaff";
import Pagination from "@/components/ui/Pagination";
import AddBookForm from "@/components/ui/addBookForm";
import useBookManagement from "@/hooks/useBookManagement";

export default function BookManagement() {
  const {
    // State từ hook
    selectedCategory,
    selectedBooks,
    currentPage,
    searchTerm: hookSearchTerm,
    currentBooks,
    filteredBooks,
    totalPages,
    startIndex,
    booksPerPage,

    // Functions từ hook
    setCurrentPage,
    handleCheckChange,
    handleDeleteBooks,
    handleCategoryChange,
    clearSearch: hookClearSearch,
    setSearchTerm: hookSetSearchTerm,
    setBooks
  } = useBookManagement();

  // State cho modal - ĐẢM BẢO khởi tạo đúng
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Local search term
  const [localSearchTerm, setLocalSearchTerm] = useState(hookSearchTerm);

  // Đồng bộ local search term với hook search term
  useEffect(() => {
    setLocalSearchTerm(hookSearchTerm);
  }, [hookSearchTerm]);

  // Debug state changes
  useEffect(() => {
    console.log("showAddBookForm changed to:", showAddBookForm);
  }, [showAddBookForm]);

  useEffect(() => {
    console.log("editingBook changed to:", editingBook);
  }, [editingBook]);

  // Xử lý thay đổi search term
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    hookSetSearchTerm(value);
  };

  // Xử lý clear search
  const handleClearSearch = () => {
    setLocalSearchTerm('');
    hookClearSearch();
  };

  // Form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', localSearchTerm);
  };

  // Mở form thêm sách - SỬA LẠI ĐỂ ĐẢM BẢO STATE UPDATE
  const handleOpenAddBook = () => {
    console.log("handleOpenAddBook called");
    setEditingBook(null);
    // Dùng functional update để đảm bảo
    setShowAddBookForm(true);
  };

  // Mở form chỉnh sửa sách
  const handleOpenEditBook = (book) => {
    console.log("handleOpenEditBook called with:", book);
    setEditingBook(book);
    setShowAddBookForm(true);
  };

  // Đóng form
  const handleCloseForm = () => {
    console.log("handleCloseForm called");
    setShowAddBookForm(false);
    setEditingBook(null);
  };

  // Lưu sách (thêm mới hoặc cập nhật)
  const handleSaveBook = (bookData, bookId) => {
    console.log("handleSaveBook called with:", bookData, "bookId:", bookId);

    // Đảm bảo tags là array
    const tags = Array.isArray(bookData.categories) && bookData.categories.length > 0
      ? bookData.categories
      : bookData.category
        ? [bookData.category]
        : ["Chưa phân loại"];

    if (bookId) {
      // Cập nhật sách
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === bookId
            ? {
              ...book,
              ...bookData,
              quantity: Number(bookData.quantity),
              availability: `${bookData.quantity} cuốn`,
              tags: tags // Dùng categories làm tags
            }
            : book
        )
      );
      console.log("Book updated:", bookId);
    } else {
      // Thêm sách mới
      const newBook = {
        id: Date.now(),
        ...bookData,
        quantity: Number(bookData.quantity),
        availability: `${bookData.quantity} cuốn`,
        tags: tags // Dùng categories làm tags
      };

      setBooks(prevBooks => [newBook, ...prevBooks]);
      console.log("New book added:", newBook);
    }
  };

  // Xử lý click nút "Chỉnh sửa" trong BookCard
  const handleEditBookCard = (bookId) => {
    console.log("handleEditBookCard called for bookId:", bookId);
    const bookToEdit = currentBooks.find(book => book.id === bookId);
    if (bookToEdit) {
      console.log("Found book to edit:", bookToEdit);
      handleOpenEditBook(bookToEdit);
    } else {
      console.log("Book not found with id:", bookId);
    }
  };

  console.log("BookManagement render, showAddBookForm:", showAddBookForm);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Filter and Actions section */}
        <div className="p-6">
          <div className="max-w-8xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Phần bên trái: Thể loại + Tìm kiếm */}
              <div className="flex items-center gap-6">
                {/* Dropdown thể loại */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-6 py-3 pr-12 rounded border border-[#7A4A2E] bg-white appearance-none cursor-pointer"
                    style={{ minWidth: '200px' }}
                  >
                    <option value="all">Tất cả thể loại</option>
                    <option value="fantasy">Kỳ ảo</option>
                    <option value="sci-fi">Khoa học viễn tưởng</option>
                    <option value="history">Lịch sử</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Ô tìm kiếm */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Tìm kiếm sách hoặc tác giả..."
                      value={localSearchTerm}
                      onChange={handleSearchChange}
                      className="px-12 py-3 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9C7A6B]"
                      style={{
                        backgroundColor: '#7D5B4F',
                        minWidth: '350px'
                      }}
                    />
                    {localSearchTerm && (
                      <div
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white cursor-pointer"
                      >
                        ✕
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Hai nút button bên phải */}
              <div className="flex gap-6">
                <button
                  onClick={handleOpenAddBook}
                  className="flex items-center gap-2 px-8 py-3 text-base rounded text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#7A4A2E' }}
                >
                  <Plus size={22} />
                  Thêm sách
                </button>
                <button
                  onClick={handleDeleteBooks}
                  className="flex items-center gap-2 px-8 py-3 text-base rounded text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#DE6767' }}
                >
                  <Trash2 size={22} />
                  Xóa sách ({Object.values(selectedBooks).filter(Boolean).length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Books content section */}
        <div className="p-8 flex-1">
          <div className="max-w-8xl mx-auto">
            {currentBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-8">
                {currentBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isChecked={selectedBooks[book.id] || false}
                    onCheckChange={handleCheckChange}
                    onEdit={() => handleEditBookCard(book.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-4" style={{ color: '#7A4A2E' }}>📚</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#7A4A2E' }}>
                  {hookSearchTerm || selectedCategory !== 'all' ? 'Không tìm thấy sách phù hợp' : 'Chưa có sách trong thư viện'}
                </h3>
                <p className="text-gray-600">
                  {hookSearchTerm && selectedCategory !== 'all'
                    ? `Không tìm thấy sách nào với từ khóa "${hookSearchTerm}" trong thể loại "${selectedCategory === 'fantasy' ? 'Kỳ ảo' : selectedCategory === 'sci-fi' ? 'Khoa học viễn tưởng' : 'Lịch sử'}"`
                    : hookSearchTerm
                      ? `Không tìm thấy sách nào với từ khóa "${hookSearchTerm}"`
                      : selectedCategory !== 'all'
                        ? `Không tìm thấy sách nào trong thể loại "${selectedCategory === 'fantasy' ? 'Kỳ ảo' : selectedCategory === 'sci-fi' ? 'Khoa học viễn tưởng' : 'Lịch sử'}"`
                        : 'Hãy thêm sách mới vào thư viện của bạn!'}
                </p>
                {!hookSearchTerm && selectedCategory === 'all' && (
                  <button
                    onClick={handleOpenAddBook}
                    className="mt-4 px-8 py-3 text-base rounded text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#7A4A2E' }}
                  >
                    <Plus size={22} className="inline mr-2" />
                    Thêm sách đầu tiên
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pagination section */}
        <div className="mt-auto p-8">
          <div className="max-w-8xl mx-auto">
            {filteredBooks.length > 0 && (
              <>
                <div className="text-center mb-4 text-gray-600">
                  Hiển thị {startIndex + 1}-{Math.min(startIndex + booksPerPage, filteredBooks.length)}
                  trong tổng số {filteredBooks.length} sách
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Book Form Modal */}
      <AddBookForm
        isOpen={showAddBookForm}
        onClose={handleCloseForm}
        bookToEdit={editingBook}
        onSave={handleSaveBook}
      />
    </>
  );
}