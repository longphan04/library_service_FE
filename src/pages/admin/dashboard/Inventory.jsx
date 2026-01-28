import { useState, useEffect } from "react";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";

import PageTitle from "@/components/layouts/PageTitle";
import PageContainer from "@/components/layouts/PageContainer";
import SectionCard from "@/components/layouts/SectionCard";
import AdminTabs from "@/components/ui/AdminTabs";
import AdminSection from "@/components/layouts/AdminSection"; // Using AdminSection for consistency
import { useNavigate } from "react-router-dom";

import { getAll } from "@/services/category.service";

export default function StockInventory() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState(null); // "available" or "borrowed"
    const [filterOrder, setFilterOrder] = useState("asc"); // "asc" or "desc"

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAll();
            // Defensive: Ensure categories is always an array
            // Handle different response structures: direct array, response.data array, or nested data
            const data = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : [];
            setCategories(data);
            setFilteredCategories(data);
        } catch (error) {
            console.error("Failed to fetch inventory stats", error);
            setCategories([]);
            setFilteredCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Search functionality
    // ==========================================
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        applyFilters(term, activeFilter, filterOrder);
    };

    // ==========================================
    // Filter functionality
    // ==========================================
    const handleFilter = (filterType) => {
        let newActiveFilter;
        let newFilterOrder;

        if (activeFilter === filterType) {
            // Click cùng filter: toggle order hoặc reset
            if (filterOrder === "asc") {
                // Nếu đang tăng dần, chuyển sang giảm dần
                newActiveFilter = filterType;
                newFilterOrder = "desc";
            } else {
                // Nếu đang giảm dần, reset filter
                newActiveFilter = null;
                newFilterOrder = "asc";
            }
        } else {
            // Click filter khác hoặc lần đầu: set filter với tăng dần
            newActiveFilter = filterType;
            newFilterOrder = "asc";
        }

        setActiveFilter(newActiveFilter);
        setFilterOrder(newFilterOrder);
        applyFilters(searchTerm, newActiveFilter, newFilterOrder);
    };

    // ==========================================
    // Apply filters and search
    // ==========================================
    const applyFilters = (search, filterType, order) => {
        let result = categories;

        // Apply search filter
        if (search) {
            result = result.filter((cat) =>
                cat.name && cat.name.toLowerCase().includes(search)
            );
        }

        // Apply sorting filter
        if (filterType) {
            result = [...result].sort((a, b) => {
                let aValue, bValue;

                if (filterType === "available") {
                    const bookCopyA = parseInt(a.bookCopyCount || 0, 10);
                    const borrowedA = parseInt(a.borrowedCopy || 0, 10);
                    aValue = bookCopyA - borrowedA;

                    const bookCopyB = parseInt(b.bookCopyCount || 0, 10);
                    const borrowedB = parseInt(b.borrowedCopy || 0, 10);
                    bValue = bookCopyB - borrowedB;
                } else if (filterType === "borrowed") {
                    aValue = parseInt(a.borrowedCopy || 0, 10);
                    bValue = parseInt(b.borrowedCopy || 0, 10);
                }

                return order === "asc" ? aValue - bValue : bValue - aValue;
            });
        }

        setFilteredCategories(result);
    };

    return (
        <div className="w-full h-screen bg-[#F6EFE7] flex flex-col overflow-hidden">
            {/* Using same structure as Statistics/InventoryLog for consistency */}

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 mb-3 text-center text-[#4A3728]">
                Tồn kho
            </h1>

            {/* TAB NAVIGATION */}
            <AdminTabs active="inventory" />

            <div className="flex-1 max-w-6xl mx-auto px-4 w-full overflow-hidden">
                <div className="bg-white rounded-2xl shadow-md p-3 h-full flex flex-col">
                    {/* SEARCH */}
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20 flex-1">
                            <Loader2 className="animate-spin text-[#D9A37B]" size={40} />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar rounded-lg border border-gray-200">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#E2C6A6] sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-2 font-semibold text-[#7A4A2E]">Danh mục sách</th>
                                        <th className="px-6 py-2 font-semibold text-[#7A4A2E] text-center">Đầu sách</th>
                                        <th className="px-6 py-2 font-semibold text-[#7A4A2E] text-center">Tổng sách</th>
                                        <th className="px-6 py-2 font-semibold text-[#7A4A2E] text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                Có sẵn
                                                <button
                                                    onClick={() => handleFilter("available")}
                                                    className={`p-1 rounded transition ${
                                                        activeFilter === "available"
                                                            ? "bg-[#7A4A2E] text-white"
                                                            : "hover:bg-[#D9B698] text-[#7A4A2E]"
                                                    }`}
                                                    title={
                                                        activeFilter === "available"
                                                            ? filterOrder === "asc"
                                                                ? "Sắp xếp giảm dần"
                                                                : "Bỏ lọc"
                                                            : "Sắp xếp tăng dần"
                                                    }
                                                >
                                                    {activeFilter === "available" && filterOrder === "desc" ? (
                                                        <ChevronDown size={16} />
                                                    ) : (
                                                        <ChevronUp size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </th>
                                        <th className="px-6 py-2 font-semibold text-[#7A4A2E] text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                Đang mượn
                                                <button
                                                    onClick={() => handleFilter("borrowed")}
                                                    className={`p-1 rounded transition ${
                                                        activeFilter === "borrowed"
                                                            ? "bg-[#7A4A2E] text-white"
                                                            : "hover:bg-[#D9B698] text-[#7A4A2E]"
                                                    }`}
                                                    title={
                                                        activeFilter === "borrowed"
                                                            ? filterOrder === "asc"
                                                                ? "Sắp xếp giảm dần"
                                                                : "Bỏ lọc"
                                                            : "Sắp xếp tăng dần"
                                                    }
                                                >
                                                    {activeFilter === "borrowed" && filterOrder === "desc" ? (
                                                        <ChevronDown size={16} />
                                                    ) : (
                                                        <ChevronUp size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredCategories.map((cat, index) => {
                                        const bookCopyCount = parseInt(cat.bookCopyCount || 0, 10);
                                        const borrowedCopy = parseInt(cat.borrowedCopy || 0, 10);
                                        const available = bookCopyCount - borrowedCopy;

                                        return (
                                            <tr key={cat.category_id || cat.id || index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-2.5 font-medium text-gray-800">{cat.name}</td>
                                                <td className="px-6 py-2.5 text-center font-semibold text-gray-700">{cat.bookCount || 0}</td>
                                                <td className="px-6 py-2.5 text-center font-semibold text-gray-700">{bookCopyCount}</td>
                                                <td className="px-6 py-2.5 text-center text-green-600 font-medium">{available}</td>
                                                <td className="px-6 py-2.5 text-center text-orange-600 font-medium">{borrowedCopy}</td>
                                            </tr>
                                        );
                                    })}
                                    {filteredCategories.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                {categories.length === 0 ? "Không có dữ liệu" : "Không tìm thấy danh mục phù hợp"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
