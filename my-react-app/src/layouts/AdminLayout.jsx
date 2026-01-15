import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { useState } from "react";
import logo from "../assets/img/logo.png";

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [openDashboardMenu, setOpenDashboardMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    const logout = () => {
        navigate("/login");
    };

    // ✅ XÁC ĐỊNH TRANG CHỦ ADMIN
    const isAdminHome = location.pathname === "/admin";

    return (
        <div className="min-h-screen bg-[#F6EFE7] relative">

            {/* OVERLAY – chỉ dùng cho trang chủ */}
            {openDashboardMenu && isAdminHome && (
                <div
                    className="fixed inset-0 bg-white/75 z-20"
                    onClick={() => setOpenDashboardMenu(false)}
                />
            )}

            {/* NAVBAR */}
            <header className="h-15 bg-white flex items-center px-10 shadow-sm relative z-10">

                {/* LEFT: BACK (chỉ hiện khi KHÔNG ở trang chủ) */}
                <div className="flex-1">
                    {!isAdminHome && (
                        <button
                            onClick={() => navigate("/admin")}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                        >
                            <ArrowLeft size={18} />
                            <span className="font-medium">Trang chủ</span>
                        </button>
                    )}
                </div>

                {/* CENTER: LOGO */}
                <div className="flex-1 flex justify-center">
                    <img
                        src={logo}
                        alt="Admin Logo"
                        className="h-10 object-contain"
                    />
                </div>

                {/* RIGHT: LOGOUT */}
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={logout}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <LogOut size={22} className="text-gray-700" />
                    </button>
                </div>
            </header>

            {/* MAIN */}
            <main className="relative z-10 min-h-[calc(100vh-60px)]">

                {/* ===== TRANG CHỦ ADMIN (GIỮ NGUYÊN GIAO DIỆN CŨ) ===== */}
                {isAdminHome && (
                    <div className="flex flex-col items-center justify-center h-full">

                        <h1 className="text-3xl font-semibold pt-3 text-gray-800 mb-12">
                            Chào mừng admin
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">

                            {/* DASHBOARD */}
                            <button
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setMenuPos({
                                        x: rect.left + rect.width / 2,
                                        y: rect.top + rect.height / 2,
                                    });
                                    setOpenDashboardMenu(true);
                                }}
                                className="w-60 h-40 bg-white rounded-2xl shadow
                                flex items-center justify-center text-xl font-medium text-gray-800
                                hover:bg-gray-50 transition"
                            >
                                Bảng điều khiển
                            </button>

                            {/* USERS */}
                            <button
                                onClick={() => navigate("/admin/users")}
                                className="w-60 h-40 bg-white rounded-2xl shadow
                                flex items-center justify-center text-xl font-medium text-gray-800
                                hover:bg-gray-50 transition"
                            >
                                Quản lý người dùng
                            </button>

                            {/* STAFF */}
                            <button
                                onClick={() => navigate("/admin/staff")}
                                className="w-60 h-40 bg-white rounded-2xl shadow
                                flex items-center justify-center text-xl font-medium text-gray-800
                                hover:bg-gray-50 transition"
                            >
                                Quản lý nhân viên
                            </button>

                            {/* ACCOUNT */}
                            <button
                                onClick={() => navigate("/admin/account")}
                                className="w-60 h-40 bg-white rounded-2xl shadow
                                flex items-center justify-center text-xl font-medium text-gray-800
                                hover:bg-gray-50 transition"
                            >
                                Quản lý tài khoản
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== TRANG CHỨC NĂNG ===== */}
                {!isAdminHome && (
                    <div>
                        <Outlet />
                    </div>
                )}
            </main>

            {/* MINI MENU – CHỈ HIỆN Ở TRANG CHỦ */}
            {openDashboardMenu && isAdminHome && (
                <div
                    className="fixed z-30 w-37.5 h-32.5 bg-white rounded-xl
                    shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                    flex flex-col justify-center gap-2 px-3"
                    style={{
                        left: menuPos.x,
                        top: menuPos.y,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <button
                        onClick={() => navigate("/admin/statistics")}
                        className="bg-[#E2C6A6] text-[#7A4A2E] py-1 rounded text-sm"
                    >
                        Thống kê
                    </button>
                    <button
                        onClick={() => navigate("/admin/inventory")}
                        className="bg-[#E2C6A6] text-[#7A4A2E] py-1 rounded text-sm"
                    >
                        Tồn kho
                    </button>
                    <button
                        onClick={() => navigate("/admin/inventory-log")}
                        className="bg-[#E2C6A6] text-[#7A4A2E] py-1 rounded text-sm"
                    >
                        Biến động kho
                    </button>
                </div>
            )}
        </div>
    );
}
