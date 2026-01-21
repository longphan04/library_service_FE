import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://10.0.5.101:3000/book";
const CATEGORY_API_URL = "http://10.0.5.101:3000/category";

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

    // Fetch books từ API
    useEffect(() => {
        setLoading(true);
        axios
            .get(API_URL, {
                params: {
                    q: searchTerm || undefined,
                    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
                    page: pagination.page,
                    limit: 10,
                },
            })
            .then((res) => {
                const mappedBooks = res.data.data.map((b) => ({
                    id: b.book_id,

                    title: b.title || "Không có tiêu đề",

                    author:
                        b.authors && b.authors.length > 0
                            ? b.authors.map((a) => a.name).join(", ")
                            : "Chưa rõ tác giả",

                    publisher: b.publisher?.name || "Chưa rõ NXB",

                    availability:
                        typeof b.available_copies === "number"
                            ? `${b.available_copies} cuốn`
                            : "0 cuốn",

                    tags:
                        b.categories && b.categories.length > 0
                            ? b.categories.map((c) => c.name)
                            : ["Chưa phân loại"],

                    cover:
                        b.cover_url ||
                        "https://via.placeholder.com/150x220?text=No+Image",
                }));
                setBooks(mappedBooks);
                setPagination(res.data.pagination);

            })

            .catch((error) => {
                console.error("Lỗi khi tải sách:", error);
            })
            .finally(() => setLoading(false));
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

    const fetchBooks = async () => {
        const res = await getBooks({
            page,
            search: searchTerm,
            category: selectedCategory,
        });
        setBooks(res.data);
        setPagination(res.pagination);
    };


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
        setSearchTerm,
        setPagination,
        setSelectedBooks,
        handleCategoryChange,
        fetchBooks,
        handleDeleteBooks,
        setBooks,
    };
}