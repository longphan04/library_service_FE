import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "https://batteries-diagnosis-yard-attitudes.trycloudflare.com/book";
const CATEGORY_API_URL = "https://batteries-diagnosis-yard-attitudes.trycloudflare.com/category";

export default function useBookManagement() {
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState({});
    const [editingBook, setEditingBook] = useState(null);

    // ✅ đóng form edit
    const closeEditBook = () => {
        setEditingBook(null);
    };

    const openEditBook = async (bookId) => {
        try {
            const res = await axios.get(`${API_URL}/${bookId}`);
            setEditingBook(res.data);
        } catch (e) {
            console.error("Lỗi load book:", e);
        }
    };

    // Fetch books từ API
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL, {
                params: {
                    q: searchTerm || undefined,
                    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
                    page: pagination.page,
                    limit: 10,
                },
            });

            const mappedBooks = res.data.data.map((b) => ({
                id: b.book_id,
                title: b.title || "Không có tiêu đề",
                author: b.authors?.map((a) => a.name).join(", ") || "Chưa rõ tác giả",
                publisher: b.publisher?.name || "Chưa rõ NXB",
                availability: `${b.available_copies ?? 0} cuốn`,
                year: b.publish_year || "—",
                tags: b.categories?.map((c) => c.name) || [],
                cover: b.cover_url,
            }));

            setBooks(mappedBooks);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error("Lỗi tải sách:", err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedCategory, pagination.page]);

    // api lọc sách
    useEffect(() => {
        axios
            .get(CATEGORY_API_URL)
            .then((res) => {
                const mapped = res.data.map((c) => ({
                    id: c.category_id,
                    name: c.name,
                    bookCount: c.bookCount,
                }));
                setCategories(mapped);
            })
            .catch((err) => {
                console.error("Lỗi khi tải categories:", err);
            });
    }, []);

    // Reset về trang 1 khi thay đổi search hoặc category
    useEffect(() => {
        setPagination((p) => ({ ...p, page: 1 }));
    }, [searchTerm, selectedCategory]);

    // Xử lý thay đổi category
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Xử lý xóa nhiều sách
    const handleDeleteBooks = useCallback(async () => {
        const ids = Object.keys(selectedBooks).filter((id) => selectedBooks[id]);
        if (!ids.length) {
            alert("Chưa chọn sách");
            return;
        }

        try {
            await Promise.all(ids.map((id) => axios.delete(`${API_URL}/${id}`)));
            setBooks((prev) => prev.filter((b) => !ids.includes(String(b.id))));
            setSelectedBooks({});
        } catch (error) {
            console.error("Lỗi khi xóa sách:", error);
            alert("Có lỗi xảy ra khi xóa sách");
        }
    }, [selectedBooks]);

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