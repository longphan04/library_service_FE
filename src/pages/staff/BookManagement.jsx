import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import BookCard from "@/components/ui/BookCardStaff";
import Pagination from "@/components/ui/Pagination";
import AddBookForm from "@/components/ui/AddBookForm/addBookForm";
import useBookManagement from "@/hooks/useBookManagement";
import axios from "@/utils/axiosConfig";
import ConfirmModal from "@/components/modal/ConfirmModal";

export default function BookManagement() {
  const {
    books,
    pagination,
    categories,
    selectedCategory,
    categoryOptions,
    handleCategoryChange,
    setPagination,
    searchTerm: hookSearchTerm,
    selectedBooks,
    setSearchTerm: hookSetSearchTerm,
    setSelectedBooks,
    handleDeleteBooks,
    fetchBooks,
    openEditBook,
    closeEditBook,
    editingBook,
  } = useBookManagement();

  // State cho modal - ĐẢM BẢO khởi tạo đúng
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Local search term
  const [localSearchTerm, setLocalSearchTerm] = useState(hookSearchTerm);



  const handleEditBook = async (bookId) => {
    try {
      await openEditBook(bookId);
      setShowAddBookForm(true);
    } catch (err) {
      console.error("Không load được chi tiết sách", err);
      alert("Không thể tải dữ liệu sách");
    }
  };

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
    hookSetSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', localSearchTerm);
  };

  // Mở form thêm sách - SỬA LẠI ĐỂ ĐẢM BẢO STATE UPDATE
  const handleOpenAddBook = () => {
    console.log("handleOpenAddBook called");
    closeEditBook();
    // Dùng functional update để đảm bảo
    setShowAddBookForm(true);
  };

  // Mở form chỉnh sửa sách
  const handleOpenEditBook = (book) => {
    console.log("handleOpenEditBook called with:", book);
    // Lưu ý: handleOpenEditBook này có thể không cần thiết nếu dùng handleEditBook từ card
    setShowAddBookForm(true);
  };

  // Đóng form
  const handleCloseForm = () => {
    console.log("handleCloseForm called");
    setShowAddBookForm(false);
    closeEditBook();
  };

  // Lấy tên category
  const selectedCategoryName =
    selectedCategory === 'all'
      ? ''
      : categories.find((c) => c.id === Number(selectedCategory))?.name || '';

  const handleCheckChange = (bookId, checked) => {
    setSelectedBooks(prev => ({
      ...prev,
      [bookId]: checked,
    }));
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
                    onChange={handleCategoryChange}
                    className="border px-3 py-3 rounded"
                  >
                    <option value="all">Tất cả thể loại</option>

                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
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
                      placeholder="Tìm kiếm sách..."
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
                  className="flex items-center gap-2 px-8 py-3 text-base rounded text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: '#7A4A2E' }}
                >
                  <Plus size={22} />
                  Thêm sách
                </button>
                <button
                  onClick={() => {
                    const count = Object.values(selectedBooks).filter(Boolean).length;
                    if (count > 0) setShowConfirmDelete(true);
                  }}
                  className="flex items-center gap-2 px-8 py-3 text-base rounded text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
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
            {books.length > 0 ? (
              <div className="grid grid-cols-2 gap-8">
                {books.map((book) => (
                  <BookCard
                    key={book.book_id}
                    book={book}
                    isChecked={!!selectedBooks[book.book_id]}
                    onCheckChange={(bookId, checked) =>
                      setSelectedBooks(prev => ({
                        ...prev,
                        [bookId]: checked
                      }))
                    }
                    onEdit={handleEditBook}
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
                    ? `Không tìm thấy sách nào với từ khóa "${hookSearchTerm}" trong thể loại "${selectedCategoryName}"`
                    : hookSearchTerm
                      ? `Không tìm thấy sách nào với từ khóa "${hookSearchTerm}"`
                      : selectedCategory !== 'all'
                        ? `Không tìm thấy sách nào trong thể loại "${selectedCategoryName}"`
                        : 'Hãy thêm sách mới vào thư viện của bạn!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination section */}
        <div className="mt-auto p-8">
          <div className="max-w-8xl mx-auto">
            {books.length > 0 && pagination && (
              <>
                <div className="text-center mb-4 text-gray-600">
                  Hiển thị {((pagination.page || 1) - 1) * 10 + 1}–
                  {Math.min((pagination.page || 1) * 10, pagination.totalItems || 0)} trong tổng số {pagination.totalItems || 0} sách
                </div>

                <Pagination
                  currentPage={pagination.page || 1}
                  totalPages={pagination.totalPages || 1}
                  onPageChange={(p) =>
                    setPagination((prev) => ({ ...prev, page: p }))
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Book Form Modal */}
      <AddBookForm
        isOpen={showAddBookForm}
        bookToEdit={editingBook}
        onClose={handleCloseForm}
        onSave={() => {
          fetchBooks();
          handleCloseForm();
        }}
      />

      <ConfirmModal
        open={showConfirmDelete}
        title={`Bạn có chắc chắn muốn xóa ${Object.values(selectedBooks).filter(Boolean).length} sách đã chọn?`}
        confirmVariant="danger"
        confirmLabel="Xóa sách"
        onConfirm={async () => {
          await handleDeleteBooks();
          setShowConfirmDelete(false);
        }}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
}