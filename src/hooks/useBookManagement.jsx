import { useState, useCallback, useMemo } from "react";
import usePagination from "./usePagination";

/* ================= INITIAL BOOKS ================= */
const createInitialBooks = () => {

    return Array(30)
        .fill(null)
        .map((_, i) => {
            const quantity = 5 + (i % 6);
            return {
                id: i + 1,
                title: `Harry Potter và Hòn đá Phù thủy ${i + 1}`,
                author: `J.K. Rowling ${i + 1}`,
                publisher: [
                    "Nxb Kim Đồng",
                    "Nxb Trẻ",
                    "Nxb Giáo dục",
                    "Nxb Phương Nam",
                    "Nxb Phụ Nữ VN",
                ][i % 5],
                quantity,
                availability: `${quantity} cuốn`,
                year: 1997 + (i % 26),
                tags:
                    i % 3 === 0
                        ? ["Kỳ ảo", "Tiểu thuyết"]
                        : i % 3 === 1
                            ? ["Khoa học viễn tưởng", "Phiêu lưu"]
                            : ["Lịch sử", "Văn học"],
                category:
                    i % 3 === 0 ? "fantasy" : i % 3 === 1 ? "sci-fi" : "history",
            };
        });
};

export default function useBookManagement() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedBooks, setSelectedBooks] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState(() => createInitialBooks());

    /* ================= FILTER ================= */
    const filteredBooks = useMemo(() => {
        console.log("Filtering books with term:", searchTerm, "category:", selectedCategory);

        return books.filter(book => {
            const matchesSearch =
                searchTerm === "" ||
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" || book.category === selectedCategory;

            console.log(
                `Book ${book.id}: matchesSearch=${matchesSearch}, matchesCategory=${matchesCategory}`
            );

            return matchesSearch && matchesCategory;
        });
    }, [books, searchTerm, selectedCategory]);

    /* ================= PAGINATION ================= */
    const pagination = usePagination(filteredBooks, 10);

    /* ================= SELECT ================= */
    const handleCheckChange = useCallback((bookId, checked) => {
        setSelectedBooks(prev => ({
            ...prev,
            [bookId]: checked,
        }));
    }, []);

    /* ================= DELETE ================= */
    const handleDeleteBooks = useCallback(() => {
        const selectedIds = Object.keys(selectedBooks).filter(id => selectedBooks[id]);

        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một sách để xóa!");
            return false;
        }

        if (
            window.confirm(
                `Bạn có chắc chắn muốn xóa ${selectedIds.length} sách đã chọn?`
            )
        ) {
            const updatedBooks = books.filter(
                book => !selectedIds.includes(book.id.toString())
            );

            setBooks(updatedBooks);
            setSelectedBooks({});
            alert(`Đã xóa ${selectedIds.length} sách thành công!`);
            return true;
        }

        return false;
    }, [selectedBooks, books]);

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
        filteredBooks,

        // pagination
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        currentBooks: pagination.currentItems,
        startIndex: pagination.startIndex,
        booksPerPage: pagination.itemsPerPage,

        // setters & actions
        setSelectedCategory,
        setSelectedBooks,
        setSearchTerm: handleSetSearchTerm,
        setBooks,
        handleCheckChange,
        handleDeleteBooks,
        handleSearch,
        handleCategoryChange,
        clearSearch,

        // pagination actions
        setCurrentPage: pagination.setCurrentPage,
        resetPage: pagination.resetPage,
        goToFirstPage: pagination.goToFirstPage,
        goToLastPage: pagination.goToLastPage,
        goToNextPage: pagination.goToNextPage,
        goToPrevPage: pagination.goToPrevPage,
    };
}
