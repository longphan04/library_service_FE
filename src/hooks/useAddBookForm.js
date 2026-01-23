import { useState, useEffect, useMemo, useRef } from "react";
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
        if (!bookToEdit) return;

        setFormData({
            title: bookToEdit.title || "",
            description: bookToEdit.description || "",
            copy_quantity: String(bookToEdit.copy_quantity || "1"),
            publish_year: String(bookToEdit.publish_year || ""),
        });

        setSelectedPublisher(bookToEdit.publisher || null);
        setSelectedShelf(bookToEdit.shelf || null);
        setSelectedAuthors(bookToEdit.authors || []);
        setSelectedCategories(bookToEdit.categories || []);
    }, [bookToEdit]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowAuthorDropdown(false);
                setShowPublisherDropdown(false);
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* =======================
       FILTER
    ======================= */
    const filteredAuthors = authors.filter(a =>
        a.name.toLowerCase().includes(authorInput.toLowerCase())
    );

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

    const [previewImage, setPreviewImage] = useState(null);

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

            const authorPayload = selectedAuthors.map(a =>
                a.author_id ? a.author_id : a.name
            );

            fd.append("title", formData.title);
            fd.append("description", formData.description);
            fd.append("publish_year", formData.publish_year);
            fd.append("copy_quantity", formData.copy_quantity);
            fd.append("publisher_id", selectedPublisher.publisher_id);
            fd.append("shelf_id", selectedShelf.shelf_id);

            fd.append(
                "author_ids",
                selectedAuthors.map(a => a.author_id ?? a.name).join(",")
            );

            fd.append(
                "category_ids",
                selectedCategories.map(c => c.category_id).join(",")
            );

            if (imageFile) fd.append("image", imageFile);


            if (bookToEdit) {
                await updateBook(bookToEdit.book_id, fd);
            } else {
                await createBook(fd);
            }

            onSave();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Lưu sách thất bại");
        } finally {
            setLoading(false);
        }
    };

    // thêm tác giả
    const handleAddNewAuthor = async () => {
        if (!authorInput.trim()) return;

        try {
            const res = await createAuthor({ name: authorInput });
            const newAuthor = res.data;

            setAuthors(prev => [...prev, newAuthor]);
            setSelectedAuthors(prev => [...prev, newAuthor]);
            setAuthorInput("");
            setShowAuthorDropdown(false);
        } catch (err) {
            console.error(err);
            alert("Không thể thêm tác giả");
        }
    };

    /* =======================
       EXPORT
    ======================= */
    return {
        // refs
        wrapperRef,

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
