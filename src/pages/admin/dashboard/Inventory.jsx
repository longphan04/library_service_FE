import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

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
    const [loading, setLoading] = useState(true);

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
        } catch (error) {
            console.error("Failed to fetch inventory stats", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#F6EFE7] min-h-screen pb-10">
            {/* Using same structure as Statistics/InventoryLog for consistency */}

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 mb-3 text-center text-[#4A3728]">
                Tồn kho
            </h1>

            {/* TAB NAVIGATION */}
            <AdminTabs
                tabs={[
                    {
                        label: "Thống kê",
                        onClick: () => navigate("/admin/statistics"),
                    },
                    {
                        label: "Tồn kho",
                        active: true,
                    },
                    {
                        label: "Biến động kho",
                        onClick: () => navigate("/admin/inventory-log"),
                    },
                ]}
            />

            <div className="max-w-6xl mx-auto px-4">
                <AdminSection title="Tồn kho theo danh mục">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-[#D9A37B]" size={40} />
                        </div>
                    ) : (
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar rounded-lg border border-gray-200">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#E2C6A6] sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E]">Danh mục sách</th>
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E] text-center">Đầu sách</th>
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E] text-center">Tổng sách</th>
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E] text-center">Có sẵn</th>
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E] text-center">Đang mượn</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {categories.map((cat, index) => {
                                        const bookCopyCount = parseInt(cat.bookCopyCount || 0, 10);
                                        const borrowedCopy = parseInt(cat.borrowedCopy || 0, 10);
                                        const available = bookCopyCount - borrowedCopy;

                                        return (
                                            <tr key={cat.category_id || cat.id || index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                                <td className="px-6 py-4 text-center font-semibold text-gray-700">{cat.bookCount || 0}</td>
                                                <td className="px-6 py-4 text-center font-semibold text-gray-700">{bookCopyCount}</td>
                                                <td className="px-6 py-4 text-center text-green-600 font-medium">{available}</td>
                                                <td className="px-6 py-4 text-center text-orange-600 font-medium">{borrowedCopy}</td>
                                            </tr>
                                        );
                                    })}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AdminSection>
            </div>
        </div>
    );
}
