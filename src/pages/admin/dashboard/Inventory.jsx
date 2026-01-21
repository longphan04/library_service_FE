import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import PageTitle from "@/componants/layouts/PageTitle";
import PageContainer from "@/componants/layouts/PageContainer";
import SectionCard from "@/componants/layouts/SectionCard";
import AdminTabs from "@/componants/ui/AdminTabs";
import AdminSection from "@/componants/layouts/AdminSection"; // Using AdminSection for consistency
import { useNavigate } from "react-router-dom";

import { getCategoryStats } from "@/services/category.service";

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
            const data = await getCategoryStats();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch inventory stats", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#F6EFE7] min-h-screen pb-10">
            {/* Using same structure as Statistics/InventoryLog for consistency */}

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-6 mb-6 text-center text-[#4A3728]">
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
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E] text-center">Tổng số sách</th>
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E] text-center">Số sách có sẵn</th>
                                        <th className="px-6 py-3 font-semibold text-[#7A4A2E] text-center">Số sách đang được mượn</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {categories.map((cat, index) => (
                                        <tr key={cat.id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                            <td className="px-6 py-4 text-center font-semibold text-gray-700">{cat.total}</td>
                                            <td className="px-6 py-4 text-center text-green-600 font-medium">{cat.available}</td>
                                            <td className="px-6 py-4 text-center text-orange-600 font-medium">{cat.borrowed}</td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
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
