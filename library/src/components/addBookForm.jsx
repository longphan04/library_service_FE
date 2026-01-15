import { Search, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function AddBookForm({
  isOpen,
  onClose,
  bookToEdit = null,
  onSave
}) {
  const savedPublishers = ["Nxb Kim Đồng", "Nxb Trẻ", "Nxb Giáo dục", "Nxb Phương Nam", "Nxb Phụ Nữ VN"];
  const savedAuthors = ["Shakespeare", "J.K. Rowling", "George Orwell", "Haruki Murakami"];
  const savedCategories = ["Tiểu thuyết", "Trinh thám", "Lịch sử", "Khoa học", "Kỳ ảo", "Văn học", "Phiêu lưu", "Kinh dị"];

  // Publisher state
  const [publisherInput, setPublisherInput] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
  // Author state
  const [authorInput, setAuthorInput] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  // Category state
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Year state
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 30 },
    (_, i) => String(currentYear - i)
  );

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    categories: [],
    quantity: "1",
    year: "2025",
    description: ""
  });

  // Reset form function
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      publisher: "",
      categories: [],
      quantity: "1",
      year: "2025",
      description: ""
    });
    setSelectedAuthors([]);
    setSelectedCategories([]);
    setCategoryInput("");
    setAuthorInput("");
    setShowAuthorDropdown(false);
    setShowCategoryDropdown(false);
    setSelectedPublisher(null);
    setPublisherInput("");
    setShowPublisherDropdown(false);
  };

  // Load bookToEdit data when it changes
  useEffect(() => {
    if (bookToEdit) {
      const bookCategories =
        Array.isArray(bookToEdit.categories) && bookToEdit.categories.length > 0
          ? bookToEdit.categories
          : Array.isArray(bookToEdit.tags)
            ? bookToEdit.tags
            : [];

      setFormData({
        title: bookToEdit.title || "",
        author: bookToEdit.author || "",
        publisher: bookToEdit.publisher || "",
        categories: bookCategories,
        quantity: String(bookToEdit.quantity ?? 1),
        year: String(bookToEdit.year || new Date().getFullYear()),
        description: bookToEdit.description || ""
      });

      // đồng bộ UI
      const authorsFromBook =
        bookToEdit.author
          ? bookToEdit.author.split(",").map(a => a.trim())
          : [];

      setSelectedAuthors(authorsFromBook);
      setAuthorInput("");

      setSelectedPublisher(bookToEdit.publisher || null);
      setPublisherInput("");

      setSelectedCategories(bookCategories);
      setCategoryInput("");

    } else if (!isOpen) {
      resetForm();
    }
  }, [bookToEdit, isOpen]);

  // Filter authors và categories
  const filteredAuthors = savedAuthors.filter((a) =>
    a.toLowerCase().includes(authorInput.toLowerCase())
  );

  const filteredPublishers = savedPublishers.filter((p) =>
    p.toLowerCase().includes(publisherInput.toLowerCase())
  );

  const filteredCategories = savedCategories.filter((c) =>
    c.toLowerCase().includes(categoryInput.toLowerCase())
  );

  // Toggle category selection
  const toggleCategory = (category) => {
    let newCategories;
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter(cat => cat !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }
    setSelectedCategories(newCategories);
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const bookData = {
        ...formData,
        author: selectedAuthors.join(", "),
        publisher: selectedPublisher || formData.publisher,
        categories: selectedCategories,
        category: selectedCategories[0] || ""
      };

      console.log("Saving book data:", bookData);

      if (onSave) {
        onSave(bookData, bookToEdit?.id);
      }

      resetForm();

      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error("Error saving book:", error);
      alert("Có lỗi xảy ra khi lưu sách!");
    }
  };

  const handleClose = () => {
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-[#F5EBE0] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#7A4A2E]">
              {bookToEdit ? "Chỉnh sửa sách" : "Thêm sách mới"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              type="button"
            >
              <X size={24} className="text-[#7A4A2E]" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Image upload */}
              <div className="flex justify-center">
                <div className="w-56 h-72 bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                  <div className="w-14 h-14 rounded-full border-2 border-[#7A4A2E] flex items-center justify-center">
                    <Plus className="text-[#7A4A2E]" />
                  </div>
                </div>
              </div>

              {/* Main card */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Book name */}
                  <div className="md:col-span-1">
                    <label className="text-[#7A4A2E]">Tên sách</label>
                    <input
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border outline-none focus:border-[#7A4A2E] focus:ring-1 focus:ring-[#7A4A2E]"
                      required
                    />
                  </div>

                  {/* Author inline */}
                  <div className="relative">
                    <label className="text-[#7A4A2E]">Tác giả</label>

                    <div className="mt-1 w-full h-10 px-2 border rounded-lg flex items-center
    focus-within:border-[#7A4A2E] focus-within:ring-1 focus-within:ring-[#7A4A2E] bg-white">

                      {/* Authors text */}
                      <div className="flex-1 text-sm truncate">
                        {selectedAuthors.map((author, index) => (
                          <span key={author}>
                            {author}
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAuthors(prev => prev.filter(a => a !== author))
                              }
                              className="mx-1 text-gray-500 hover:text-red-500"
                            >
                              <X size={12} />
                            </button>
                            {index < selectedAuthors.length - 1 && ","}
                          </span>
                        ))}
                      </div>

                      {/* Add button */}
                      <button
                        type="button"
                        onClick={() => setShowAuthorDropdown(true)}
                        className="ml-2 text-[#7A4A2E] hover:opacity-70"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Dropdown */}
                    {showAuthorDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow max-h-48 overflow-y-auto">
                        {filteredAuthors.map((a) => (
                          <div
                            key={a}
                            onClick={() => {
                              if (!selectedAuthors.includes(a)) {
                                setSelectedAuthors(prev => [...prev, a]);
                              }
                              setAuthorInput("");
                              setShowAuthorDropdown(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {a}
                          </div>
                        ))}

                        {/* Add new author */}
                        {authorInput && !savedAuthors.includes(authorInput) && (
                          <div
                            onClick={() => {
                              setSelectedAuthors(prev => [...prev, authorInput]);
                              setAuthorInput("");
                              setShowAuthorDropdown(false);
                            }}
                            className="px-3 py-2 text-[#7A4A2E] hover:bg-gray-100 cursor-pointer"
                          >
                            ➕ Thêm tác giả "{authorInput}"
                          </div>
                        )}

                        <input
                          value={authorInput}
                          onChange={(e) => setAuthorInput(e.target.value)}
                          className="w-full px-3 py-2 border-t outline-none text-sm"
                          placeholder="Nhập tên tác giả mới..."
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Publisher */}
                  <div className="relative">
                    <label className="text-[#7A4A2E]">Nhà xuất bản</label>

                    <div className="relative mt-1">
                      {selectedPublisher ? (
                        <div className="flex items-center justify-between h-10 px-3 border rounded-lg bg-gray-50 text-sm leading-none">
                          <span className="text-sm">{selectedPublisher}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPublisher(null);
                              handleInputChange("publisher", "");
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            value={publisherInput}
                            onChange={(e) => {
                              setPublisherInput(e.target.value);
                              setShowPublisherDropdown(true);
                              handleInputChange("publisher", e.target.value);
                            }}
                            onFocus={() => setShowPublisherDropdown(true)}
                            onBlur={() => setTimeout(() => setShowPublisherDropdown(false), 200)}
                            className="w-full p-2 pr-10 rounded-lg border outline-none focus:border-[#7A4A2E] focus:ring-1 focus:ring-[#7A4A2E]"
                            placeholder="Nhập hoặc chọn NXB..."
                          />
                          <Search size={16} className="absolute right-3 top-3 text-gray-400" />
                        </>
                      )}

                      {showPublisherDropdown && publisherInput && !selectedPublisher && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow max-h-48 overflow-y-auto">
                          {filteredPublishers.length > 0 ? (
                            filteredPublishers.map((p) => (
                              <div
                                key={p}
                                onClick={() => {
                                  setSelectedPublisher(p);
                                  setPublisherInput("");
                                  setShowPublisherDropdown(false);
                                  handleInputChange("publisher", p);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {p}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                              Không tìm thấy NXB
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category dropdown with checkboxes */}
                  <div className="relative">
                    <label className="text-[#7A4A2E]">Thể loại</label>
                    <div className="relative mt-1">
                      <input
                        value={selectedCategories.length > 0 ? selectedCategories.join(", ") : categoryInput}
                        onChange={(e) => {
                          if (selectedCategories.length === 0) {
                            setCategoryInput(e.target.value);
                          }
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                        className="w-full p-2 pr-16 rounded-lg border outline-none focus:border-[#7A4A2E] focus:ring-1 focus:ring-[#7A4A2E]"
                        placeholder="Tìm kiếm thể loại..."
                        readOnly={selectedCategories.length > 0}
                      />

                      {/* Clear all button */}
                      {selectedCategories.length > 0 && (
                        <div
                          type="button"
                          onClick={() => {
                            setSelectedCategories([]);
                            setFormData(prev => ({ ...prev, categories: [] }));
                            setCategoryInput("");
                          }}
                          className="absolute right-9 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </div>
                      )}

                      <Search size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />

                      {showCategoryDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow max-h-64 overflow-y-auto">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <div
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                              >
                                <span>{category}</span>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedCategories.includes(category)
                                  ? 'bg-[#7A4A2E] border-[#7A4A2E]'
                                  : 'border-gray-300'
                                  }`}>
                                  {selectedCategories.includes(category) && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                              Không tìm thấy thể loại
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity + Year */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#7A4A2E]">Số lượng</label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border outline-none focus:border-[#7A4A2E] focus:ring-1 focus:ring-[#7A4A2E]"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-[#7A4A2E]">Xuất bản</label>
                      <select
                        value={formData.year}
                        onChange={(e) => handleInputChange("year", e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border outline-none
             focus:border-[#7A4A2E] focus:ring-1 focus:ring-[#7A4A2E]"
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6">
              <label className="text-[#7A4A2E]">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={6}
                className="w-full mt-2 p-3 rounded-xl border outline-none focus:border-[#7A4A2E] focus:ring-1 focus:ring-[#7A4A2E]"
                placeholder="Mô tả về sách..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#7A4A2E] text-white rounded-full hover:bg-[#6a3a1e] transition-colors font-medium"
              >
                {bookToEdit ? "Cập nhật sách" : "Thêm sách"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors font-medium"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}