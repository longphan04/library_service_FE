import { useState, useEffect, useMemo, useRef } from "react";
import { IMAGE_BASE_URL } from "@/config/constants";
import {
    getAuthors,
    getPublishers,
    getShelves,
    getCategories,
    createBook,
    updateBook,
    createAuthor,
} from "@/components/ui/AddBookForm/addBook.api";

export default function useAddBookForm({
    bookToEdit,
    onSave,
    onClose,
}) {
    /* =======================
       MASTER DATA
    ======================= */
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [shelves, setShelves] = useState([]);
    const [categories, setCategories] = useState([]);

    /* =======================
       UI STATES (BẮT BUỘC DO UI DÙNG)
    ======================= */
    const [authorInput, setAuthorInput] = useState("");
    const [publisherInput, setPublisherInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");

    const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
    const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    /* =======================
       FORM STATE
    ======================= */
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        copy_quantity: "1",
        publish_year: String(new Date().getFullYear()),
    });

    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showAuthorInput, setShowAuthorInput] = useState(false);
    /* =======================
       LOAD DATA
    ======================= */
    useEffect(() => {
        Promise.all([
            getAuthors(),
            getPublishers(),
            getShelves(),
            getCategories(),
        ]).then(([a, p, s, c]) => {
            setAuthors(a.data);
            setPublishers(p.data);
            setShelves(s.data);
            setCategories(c.data);
        });
    }, []);

    /* =======================
       EDIT MODE
    ======================= */
    useEffect(() => {
        if (!bookToEdit) {
            setFormData({
                title: "",
                description: "",
                copy_quantity: "1",
                publish_year: String(new Date().getFullYear()),
            });
            setSelectedAuthors([]);
            setSelectedPublisher(null);
            setSelectedShelf(null);
            setSelectedCategories([]);
            setPreviewImage(null);
            return;
        }

        if (bookToEdit.cover_url) {
            setPreviewImage(`${IMAGE_BASE_URL}/${bookToEdit.cover_url}`);
        }

        setFormData({
            title: bookToEdit.title || "",
            description: bookToEdit.description || "",
            copy_quantity: String(bookToEdit.available_copies || bookToEdit.total_copies || "1"),
            publish_year: String(bookToEdit.publish_year || ""),
        });

        setSelectedPublisher(bookToEdit.publisher || null);
        setSelectedShelf(bookToEdit.shelf || null);
        setSelectedAuthors(bookToEdit.authors || []);
        setSelectedCategories(bookToEdit.categories || []);
    }, [bookToEdit]);



    /* =======================
       FILTER
    ======================= */
    const filteredAuthors = useMemo(() => {
        return authors.filter(a =>
            a.name.toLowerCase().includes(authorInput.toLowerCase())
        );
    }, [authors, authorInput]);

    const filteredPublishers = publishers.filter(p =>
        p.name.toLowerCase().includes(publisherInput.toLowerCase())
    );

    const filteredCategories = useMemo(() => {
        return categories.filter(c =>
            c.name.toLowerCase().includes(categoryInput.toLowerCase())
        );
    }, [categories, categoryInput]);

    /* =======================
       HANDLERS
    ======================= */
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.some(c => c.category_id === category.category_id)
                ? prev.filter(c => c.category_id !== category.category_id)
                : [...prev, category]
        );
    };

    const wrapperRef = useRef(null);
    const authorDropdownRef = useRef(null);
    const publisherDropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Đóng tác giả nếu click ra ngoài
            if (authorDropdownRef.current && !authorDropdownRef.current.contains(e.target)) {
                setShowAuthorDropdown(false);
            }
            // Đóng nhà xuất bản nếu click ra ngoài
            if (publisherDropdownRef.current && !publisherDropdownRef.current.contains(e.target)) {
                setShowPublisherDropdown(false);
            }
            // Đóng thể loại nếu click ra ngoài
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthors.length === 0) {
            alert("Vui lòng chọn ít nhất một tác giả");
            return;
        }

        if (!selectedPublisher || !selectedShelf) {
            alert("Vui lòng chọn Nhà xuất bản và Kệ sách");
            return;
        }

        try {
            setLoading(true);

            const fd = new FormData();

            fd.append("title", formData.title);
            fd.append("description", formData.description);
            fd.append("publish_year", formData.publish_year);
            fd.append("copy_quantity", formData.copy_quantity);
            fd.append("publisher_id", selectedPublisher.publisher_id);
            fd.append("shelf_id", selectedShelf.shelf_id);

            // Gửi mảng IDs cho authors và categories
            selectedAuthors.forEach(a => {
                fd.append("author_ids[]", a.author_id);
            });

            selectedCategories.forEach(c => {
                fd.append("category_ids[]", c.category_id);
            });

            if (imageFile) fd.append("image", imageFile);

            if (bookToEdit) {
                await updateBook(bookToEdit.book_id, fd);
            } else {
                await createBook(fd);
            }

            onSave();
            onClose();
        } catch (err) {
            console.error("Lỗi khi lưu sách:", err);
            if (err.response?.data) {
                console.error("Chi tiết lỗi từ server:", err.response.data);
                alert(`Lưu sách thất bại: ${err.response.data.message || "Lỗi validation"}`);
            } else {
                alert("Lưu sách thất bại: Lỗi hệ thống");
            }
        } finally {
            setLoading(false);
        }
    };

    // thêm tác giả
    const handleAddNewAuthor = async () => {
        const nameToAdd = authorInput.trim();
        if (!nameToAdd) return;

        try {
            const res = await createAuthor({ name: nameToAdd });
            // API trả về object author mới có author_id và name
            const newAuthor = res.data;

            if (newAuthor && (newAuthor.author_id || newAuthor.id)) {
                // Đảm bảo lấy đúng ID trường hợp API trả về key khác
                const normalizedAuthor = {
                    author_id: newAuthor.author_id || newAuthor.id,
                    name: newAuthor.name
                };

                setAuthors(prev => [...prev, normalizedAuthor]);
                setSelectedAuthors(prev => [...prev, normalizedAuthor]);
                setAuthorInput("");
                setShowAuthorDropdown(false);
            } else {
                throw new Error("Dữ liệu trả về từ API không hợp lệ");
            }
        } catch (err) {
            console.error("Lỗi khi thêm tác giả:", err);
            const errorMsg = err.response?.data?.message || "Không thể thêm tác giả vào hệ thống";
            alert(errorMsg);
        }
    };

    /* =======================
       EXPORT
    ======================= */
    return {
        // refs
        wrapperRef,
        authorDropdownRef,
        publisherDropdownRef,
        categoryDropdownRef,

        // master
        authors,
        publishers,
        shelves,
        categories,

        // filter
        filteredAuthors,
        filteredPublishers,
        filteredCategories,

        // inputs
        authorInput,
        publisherInput,
        categoryInput,
        setAuthorInput,
        setPublisherInput,
        setCategoryInput,
        showAuthorInput,
        setShowAuthorInput,

        // image
        previewImage,
        handleImageChange,

        // dropdown
        showAuthorDropdown,
        showPublisherDropdown,
        showCategoryDropdown,
        setShowAuthorDropdown,
        setShowPublisherDropdown,
        setShowCategoryDropdown,

        // form
        formData,
        selectedAuthors,
        selectedPublisher,
        selectedShelf,
        selectedCategories,
        loading,

        // setters
        setSelectedAuthors,
        setSelectedPublisher,
        setSelectedShelf,
        setSelectedCategories,

        // actions
        handleInputChange,
        handleAddNewAuthor,
        toggleCategory,
        handleSubmit,
    };
}
