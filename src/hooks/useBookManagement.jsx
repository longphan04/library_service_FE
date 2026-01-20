import { useState, useCallback, useEffect } from "react";
import usePagination from "./usePagination";
import axios from "axios";
import bookService from "@/services/book.service";

export default function useBookManagement() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedBooks, setSelectedBooks] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_URL = "http://10.0.5.101:3000/book";

    useEffect(() => {
        let isMounted = true;
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const params = {
                    category: selectedCategory !== "all" ? selectedCategory : undefined,
                    keyword: searchTerm || undefined,
                };
                const result = await bookService.getAll(params);
                if (isMounted) setBooks(result.data || result.books || []);
            } catch (err) {
                if (isMounted) console.error("Lỗi khi lấy sách:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchBooks();
        return () => { isMounted = false; };
    }, [searchTerm, selectedCategory]);

    /* ================= PAGINATION ================= */
    const pagination = usePagination(filteredBooks, 10);

    /* ================= SELECT ================= */
    const handleCheckChange = useCallback((bookId, checked) => {
        setSelectedBooks(prev => ({
            ...prev,
            [bookId]: checked,
        }));
    }, []);

    await axios.delete(`${API_URL}/${id}`, {
        headers: {
            // Authorization: `Bearer ${token}`,
        },
    });


    /* ================= SEARCH ================= */
    const handleSearch = useCallback(
        e => {
            if (e) e.preventDefault();
            console.log("Searching for:", searchTerm);
        },
        [searchTerm]
    );

    const handleCategoryChange = useCallback(
        category => {
            setSelectedCategory(category);
            pagination.resetPage();
        },
        [pagination]
    );

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        pagination.resetPage();
    }, [pagination]);

    const handleSetSearchTerm = useCallback(
        term => {
            console.log("Setting search term:", term);
            setSearchTerm(term);
            pagination.resetPage();
        },
        [pagination]
    );

    /* ================= RETURN ================= */
    return {
        // state
        selectedCategory,
        selectedBooks,
        searchTerm,
        books,
        loading,

        // pagination
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        currentBooks: pagination.currentItems,

        // setters & actions
        handleCheckChange,
        handleDeleteBooks,
        setSearchTerm: handleSetSearchTerm,
        handleCategoryChange,
        clearSearch,

        // pagination actions
        setCurrentPage: pagination.setCurrentPage,
    };
}
