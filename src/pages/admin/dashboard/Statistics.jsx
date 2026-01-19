import { useNavigate } from "react-router-dom";

export default function StockInventory() {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-[#F6EFE7] pb-10">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 mb-6 text-center">
                Thống kê
            </h1>

            {/* TAB BUTTONS */}
            <div className="flex justify-center gap-4 mb-10">
                <button
                    className="px-6 py-2 rounded-full bg-[#D9A37B] text-white cursor-default"
                >
                    Thống kê
                </button>

                <button
                    onClick={() => navigate("/admin/inventory")}
                    className="px-6 py-2 rounded-full bg-[#E2C6A6] text-[#7A4A2E] hover:opacity-90"
                >
                    Tồn kho
                </button>


                <button
                    onClick={() => navigate("/admin/inventory-log")}
                    className="px-6 py-2 rounded-full bg-[#E2C6A6] text-[#7A4A2E] hover:opacity-90"
                >
                    Biến động kho
                </button>
            </div>
        </div>
    );
}