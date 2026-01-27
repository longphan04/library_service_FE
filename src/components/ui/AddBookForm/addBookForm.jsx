import { Plus, X, Check, XCircle } from "lucide-react";
import useAddBookForm from "../../../hooks/useAddBookForm";
import { useRef, useState } from "react";
import ConfirmModal from "../../modal/ConfirmModal";

export default function AddBookForm({ isOpen, onClose, bookToEdit, onSave }) {
    // 1. All hooks must be called at the very top
    const fileInputRef = useRef(null);
    const [showAuthorInput, setShowAuthorInput] = useState(false);
    const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);

    // yearOptions is not a hook but needs to be defined
    const yearOptions = Array.from(
        { length: 50 },
        (_, i) => new Date().getFullYear() - i
    );

    const {
        wrapperRef,
        // data
        formData,
        shelves,
        authors,
        categories,

        // selected
        selectedAuthors,
        selectedPublisher,
        selectedCategories,
        selectedShelf,

        // refs
        authorDropdownRef,
        publisherDropdownRef,
        categoryDropdownRef,

        // inputs
        authorInput,
        publisherInput,
        categoryInput,
        previewImage,
        handleImageChange,

        // UI state
        showAuthorDropdown,
        showPublisherDropdown,
        showCategoryDropdown,

        // computed
        filteredAuthors,
        filteredPublishers,
        filteredCategories,

        // handlers
        handleInputChange,
        toggleCategory,
        handleAddNewAuthor,
        handleSubmit,

        // setters
        setSelectedAuthors,
        setSelectedPublisher,
        setSelectedCategories,
        setSelectedShelf,
        setAuthorInput,
        setPublisherInput,
        setCategoryInput,
        setShowAuthorDropdown,
        setShowPublisherDropdown,
        setShowCategoryDropdown,
    } = useAddBookForm({ bookToEdit, onClose, onSave });

    // 2. Early return AFTER all hooks
    if (!isOpen) return null;

    const handleClearAllCategories = () => {
        setSelectedCategories([]);
    };

    const handleClearAllAuthors = () => {
        setSelectedAuthors([]);
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();
        if (bookToEdit) {
            setShowConfirmUpdate(true);
        } else {
            handleSubmit(e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div ref={wrapperRef} className="bg-[#F5EBE0] rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
                <div className="p-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-[#7A4A2E]">
                            {bookToEdit ? "Chỉnh sửa sách" : "Thêm sách mới"}
                        </h2>
                        <button
                            onClick={onClose}
                            type="button"
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="flex gap-8">
                        {/* Image */}
                        <div className="flex-shrink-0">
                            <div
                                className="w-72 h-80 bg-gray-200 rounded-2xl overflow-hidden cursor-pointer"
                                onClick={() => fileInputRef.current.click()}
                            >
                                {previewImage ? (
                                    <img src={previewImage} className="w-full h-full object-cover" />
                                ) : bookToEdit?.image ? (
                                    <img src={bookToEdit.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <Plus size={64} className="text-gray-500 mb-3" />
                                    </div>
                                )}
                            </div>

                            {/* ✅ INPUT FILE BẮT BUỘC */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Main Form */}
                        <div className="flex-1 flex flex-col">
                            <div className="bg-white rounded-2xl p-8 mb-6">
                                {/* Dòng 1: Tên sách và Tác giả */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Tên sách */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Tên sách *
                                        </label>
                                        <input
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            placeholder="Nhập tên sách"
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-3 focus:ring-[#7A4A2E] focus:border-transparent text-base"
                                        />
                                    </div>

                                    {/* Tác giả */}
                                    <div className="relative" ref={authorDropdownRef}>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Tác giả *
                                        </label>
                                        <div className="relative">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex-1 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-gray-500 overflow-hidden"
                                                    onClick={() => {
                                                        setShowAuthorDropdown(!showAuthorDropdown);
                                                        setShowAuthorInput(false);
                                                    }}
                                                >
                                                    <div className="p-3">
                                                        {selectedAuthors.length > 0 ? (
                                                            <div className="flex items-center justify-between min-w-0">
                                                                <span className="text-gray-800 text-base truncate block overflow-hidden whitespace-nowrap max-w-full">
                                                                    {selectedAuthors.map(a => a.name).join(", ")}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-500 text-base">Chọn tác giả</span>
                                                                <Plus size={20} className="text-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {selectedAuthors.length > 0 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearAllAuthors();
                                                        }}
                                                        className="p-3 text-gray-600 hover:text-red-600 transition-colors flex-shrink-0"
                                                        title="Xóa tất cả tác giả"
                                                    >
                                                        <XCircle size={22} />
                                                    </button>
                                                )}
                                            </div>

                                            {showAuthorDropdown && (
                                                <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 rounded-xl shadow-2xl mt-2 z-20">
                                                    <input
                                                        value={authorInput}
                                                        onChange={(e) => {
                                                            setAuthorInput(e.target.value);
                                                            setShowAuthorInput(e.target.value.length > 0);
                                                        }}
                                                        placeholder="Tìm tác giả..."
                                                        className="w-full p-3 border-b-2 border-gray-200 text-base focus:outline-none"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="max-h-56 overflow-y-auto">
                                                        {filteredAuthors.slice().map(a => (
                                                            <div
                                                                key={a.author_id}
                                                                onClick={() => {
                                                                    if (!selectedAuthors.some(x => x.author_id === a.author_id)) {
                                                                        setSelectedAuthors(prev => [...prev, a]);
                                                                    }
                                                                    setShowAuthorDropdown(false);
                                                                    setAuthorInput("");
                                                                }}
                                                                className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center text-base"
                                                            >
                                                                <span className="font-medium">{a.name}</span>
                                                                {selectedAuthors.some(x => x.author_id === a.author_id) && (
                                                                    <Check size={20} className="text-green-600" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Phần thêm tác giả mới */}
                                                    <div className="border-t border-gray-300 p-3 bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                value={authorInput}
                                                                onChange={(e) => {
                                                                    setAuthorInput(e.target.value);
                                                                    setShowAuthorInput(e.target.value.length > 0);
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base"
                                                                placeholder="Nhập tên tác giả mới..."
                                                            />
                                                            {showAuthorInput &&
                                                                authorInput.trim().length > 0 &&
                                                                !authors.some(a =>
                                                                    a.name.toLowerCase() === authorInput.toLowerCase().trim()
                                                                ) && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleAddNewAuthor();
                                                                            setAuthorInput("");
                                                                            setShowAuthorInput(false);
                                                                        }}
                                                                        className="bg-[#7A4A2E] text-white p-2 rounded-lg hover:bg-[#6a3a1e] transition-colors"
                                                                    >
                                                                        <Plus size={20} />
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 2: Nhà xuất bản và Thể loại */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Nhà xuất bản */}
                                    <div className="relative" ref={publisherDropdownRef}>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Nhà xuất bản
                                        </label>
                                        <div className="relative">
                                            <div
                                                className="border-2 border-gray-300 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:border-gray-500 transition-colors"
                                                onClick={() => setShowPublisherDropdown(!showPublisherDropdown)}
                                            >
                                                <span className={!selectedPublisher ? "text-gray-500 text-base" : "text-gray-800 font-medium text-base"}>
                                                    {selectedPublisher?.name || "Chọn nhà xuất bản"}
                                                </span>
                                                <Plus size={20} className="text-gray-500" />
                                            </div>

                                            {showPublisherDropdown && (
                                                <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 rounded-xl shadow-2xl mt-2 z-20">
                                                    <input
                                                        value={publisherInput}
                                                        onChange={(e) => setPublisherInput(e.target.value)}
                                                        placeholder="Tìm nhà xuất bản..."
                                                        className="w-full p-3 border-b-2 border-gray-200 text-base focus:outline-none"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="max-h-56 overflow-y-auto">
                                                        {filteredPublishers.slice().map(p => (
                                                            <div
                                                                key={p.publisher_id}
                                                                onClick={() => {
                                                                    setSelectedPublisher(p);
                                                                    setShowPublisherDropdown(false);
                                                                    setPublisherInput("");
                                                                }}
                                                                className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center text-base"
                                                            >
                                                                <span className="font-medium">{p.name}</span>
                                                                {selectedPublisher?.publisher_id === p.publisher_id && (
                                                                    <Check size={20} className="text-green-600" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Thể loại */}
                                    <div className="relative" ref={categoryDropdownRef}>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Thể loại
                                        </label>
                                        <div className="relative">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex-1 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-gray-500 overflow-hidden"
                                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                                >
                                                    <div className="p-3">
                                                        {selectedCategories.length > 0 ? (
                                                            <div className="flex items-center justify-between min-w-0">
                                                                <span className="text-gray-800 text-base truncate block overflow-hidden whitespace-nowrap max-w-full">
                                                                    {selectedCategories.map(c => c.name).join(", ")}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-500 text-base">Chọn thể loại</span>
                                                                <Plus size={20} className="text-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {selectedCategories.length > 0 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearAllCategories();
                                                        }}
                                                        className="p-3 text-gray-600 hover:text-red-600 transition-colors flex-shrink-0"
                                                        title="Xóa tất cả thể loại"
                                                    >
                                                        <XCircle size={22} />
                                                    </button>
                                                )}
                                            </div>

                                            {showCategoryDropdown && (
                                                <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 rounded-xl shadow-2xl mt-2 z-20">
                                                    <input
                                                        value={categoryInput}
                                                        onChange={(e) => setCategoryInput(e.target.value)}
                                                        placeholder="Tìm thể loại..."
                                                        className="w-full p-3 border-b-2 border-gray-200 text-base focus:outline-none"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="max-h-56 overflow-y-auto">
                                                        {filteredCategories.slice().map(c => (
                                                            <div
                                                                key={c.category_id}
                                                                onClick={() => toggleCategory(c)}
                                                                className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center text-base"
                                                            >
                                                                <span className="font-medium">{c.name}</span>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedCategories.some(x => x.category_id === c.category_id)}
                                                                    onChange={() => { }}
                                                                    className="w-5 h-5 text-[#7A4A2E] rounded"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 3: Kệ sách, Số lượng, Năm xuất bản */}
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Kệ sách */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Kệ sách
                                        </label>
                                        <select
                                            value={selectedShelf?.shelf_id || ""}
                                            onChange={(e) =>
                                                setSelectedShelf(
                                                    shelves.find(s => s.shelf_id === Number(e.target.value))
                                                )
                                            }
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-3 focus:ring-[#7A4A2E] focus:border-transparent text-base"
                                        >
                                            <option value="">Chọn kệ</option>
                                            {shelves.slice().map(s => (
                                                <option key={s.shelf_id} value={s.shelf_id}>
                                                    {s.code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Số lượng */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Số lượng
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.copy_quantity}
                                            onChange={(e) =>
                                                handleInputChange("copy_quantity", e.target.value)
                                            }
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-3 focus:ring-[#7A4A2E] focus:border-transparent text-base"
                                            placeholder="1"
                                        />
                                    </div>

                                    {/* Năm xuất bản */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Năm xuất bản
                                        </label>
                                        <select
                                            value={formData.publish_year}
                                            onChange={(e) =>
                                                handleInputChange("publish_year", e.target.value)
                                            }
                                            className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-3 focus:ring-[#7A4A2E] focus:border-transparent text-base"
                                        >
                                            <option value="">Chọn năm</option>
                                            {yearOptions.slice(0).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-10 h-[full]">
                        <label className="block text-base font-semibold text-gray-800 mb-4">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange("description", e.target.value)
                            }
                            className="w-full flex-1 border-2 border-gray-300 p-4 rounded-xl
             focus:ring-3 focus:ring-[#7A4A2E] resize-none text-base"
                            placeholder="Nhập mô tả về sách..."
                        />
                    </div>
                    {/* Actions */}
                    <div className="flex justify-center gap-6 mt-8">
                        <button
                            onClick={handlePreSubmit}
                            className="bg-[#7A4A2E] text-white px-12 py-4 rounded-xl font-semibold text-lg hover:bg-[#6a3a1e] transition-colors cursor-pointer"
                        >
                            {bookToEdit ? "Cập nhật sách" : "Thêm sách"}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-12 py-4 bg-gray-200 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showConfirmUpdate}
                title="Bạn có chắc chắn muốn cập nhật thông tin sách này?"
                onConfirm={(e) => {
                    handleSubmit(e);
                    setShowConfirmUpdate(false);
                }}
                onCancel={() => setShowConfirmUpdate(false)}
            />
        </div>
    );
}