import { useState, useEffect, useCallback } from "react";
import axios from "@/utils/axiosConfig";

const API_PATH = "/book";
const CATEGORY_API_PATH = "/category";

export default function useBookManagement() {
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState({});
    const [editingBook, setEditingBook] = useState(null);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // ✅ đóng form edit
    const closeEditBook = () => {
        setEditingBook(null);
    };

    const openEditBook = async (bookId) => {
        try {
            const res = await axios.get(`${API_PATH}/${bookId}`);
            setEditingBook(res.data);
        } catch (e) {
            console.error("Lỗi load book:", e);
        }
    };

    // Fetch books từ API
    const fetchBooks = useCallback(async (isMounted) => {
        setLoading(true);
        try {
            const res = await axios.get(API_PATH, {
                params: {
                    q: debouncedSearchTerm || undefined,
                    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
                    page: pagination?.page || 1,
                    limit: 10,
                },
            });

            if (!isMounted()) return;

            console.log("📚 API Response:", res.data);

            // Kiểm tra structure của response
            if (!res.data || !res.data.data) {
                console.error("❌ Invalid response structure:", res.data);
                setBooks([]);
                return;
            }

            setBooks(res.data.data);

            // ✅ Đảm bảo pagination luôn là object
            if (res.data.pagination) {
                setPagination(res.data.pagination);
            } else {
                setPagination(prev => ({
                    ...prev,
                    page: 1,
                    totalPages: 1,
                    totalItems: res.data.data.length
                }));
            }
        } catch (err) {
            if (!isMounted()) return;
            console.error("Lỗi tải sách:", err);
            console.error("Response data:", err.response?.data);
        } finally {
            if (isMounted()) setLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategory, pagination?.page]);

    // api lọc sách
    useEffect(() => {
        axios
            .get(CATEGORY_API_PATH)
            .then((res) => {
                console.log("📂 Categories Response:", res.data);

                // Kiểm tra xem res.data có phải là array không
                if (!Array.isArray(res.data)) {
                    console.error("❌ Categories response is not an array:", res.data);
                    setCategories([]);
                    return;
                }

                const mapped = res.data.map((c) => ({
                    id: c.category_id,
                    name: c.name,
                    bookCount: c.bookCount,
                }));
                setCategories(mapped);
            })
            .catch((err) => {
                console.error("Lỗi khi tải categories:", err);
                console.error("Response data:", err.response?.data);
            });
    }, []);

    // Fetch books on dependency change with cleanup to prevent race conditions
    useEffect(() => {
        let active = true;
        const isMounted = () => active;

        // Reset to page 1 when search or category changes
        // This is done implicitly by the component calling hookSetSearchTerm or handleCategoryChange
        // but we need to ensure pagination.page updates before fetching or we fetch twice.

        fetchBooks(isMounted);

        return () => {
            active = false;
        };
    }, [fetchBooks]);

    // Reset về trang 1 khi thay đổi search hoặc category
    useEffect(() => {
        setPagination((p) => ({ ...p, page: 1 }));
    }, [debouncedSearchTerm, selectedCategory]);

    // Xử lý thay đổi category
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    // Xử lý xóa nhiều sách
    const handleDeleteBooks = async () => {
        const ids = Object.keys(selectedBooks).filter(id => selectedBooks[id]);

        if (!ids.length) {
            alert("Chưa chọn sách");
            return;
        }

        try {
            await Promise.all(
                ids.map(id => axios.delete(`${API_PATH}/${id}`))
            );

            setBooks(prev => prev.filter(b => !ids.includes(String(b.book_id))));
            setSelectedBooks({});
        } catch (err) {
            console.error("Lỗi khi xóa sách:", err);
            alert("Không thể xóa sách (có thể sách đang được mượn)");
        }
    };

    return {
        books,
        loading,
        searchTerm,
        pagination,
        selectedCategory,
        selectedBooks,
        categories,
        editingBook,
        setSearchTerm,
        setPagination,
        setSelectedBooks,
        handleCategoryChange,
        openEditBook,
        closeEditBook,
        fetchBooks,
        handleDeleteBooks,
        setBooks,
    };
}