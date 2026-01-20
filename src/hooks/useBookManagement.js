import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://10.0.5.101:3000/book";

export default function useBookManagement() {
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalItems: 0,
    });
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

    // Reset về trang 1 khi thay đổi search hoặc category
    useEffect(() => {
        setPagination((p) => ({ ...p, page: 1 }));
    }, [searchTerm, selectedCategory]);

    // Tạo danh sách categories từ books
    const categories = Array.from(new Set(books.flatMap((b) => b.tags || [])));

    // Xử lý thay đổi category
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
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
        handleDeleteBooks,
        setBooks,
    };
}