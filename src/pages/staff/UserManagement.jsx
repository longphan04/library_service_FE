import { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import useUserManagement from "@/hooks/useUserManagement";
import UserDetailModal from "@/components/UserDetailModal/UserDetailModal";
import { Search } from "lucide-react";

const usersData = [
    { id: 1, name: "Leslie Maya", email: "leslie@gmail.com", date: "22/02/2010", status: "locked" },
    { id: 2, name: "Mike Dean", email: "mike@gmail.com", date: "14/04/2015", status: "active" },
    { id: 3, name: "Jorge Ferreira", email: "jorge@gmail.com", date: "14/03/2018", status: "active" },
];

export default function UserManagement() {
    const {
        currentItems,
        currentPage,
        totalPages,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        selectedUsers,
        selectedIds,
        isAllSelected,
        toggleUser,
        toggleSelectAll,
        lockUsers,
        unlockUsers,
        setUsers,
        users,
    } = useUserManagement(usersData);

    const handleSaveUser = (updatedUser) => {
        setUsers(prev =>
            prev.map(u =>
                u.id === updatedUser.id ? updatedUser : u
            )
        );
    };

    const [selectedUser, setSelectedUser] = useState(null);

    // Ngăn sự kiện click lan truyền để checkbox và các nút hành động hoạt động độc lập
    const handleRowClick = (user, e) => {
        // Ngăn sự kiện click khi click vào checkbox, nút hành động hoặc các phần tử con khác
        if (
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'BUTTON' ||
            e.target.closest('.actions-container') ||
            e.target.closest('button')
        ) {
            return;
        }

        // Mở modal khi click vào các phần khác của hàng
        setSelectedUser(user);
    };

    // Hàm để mở khóa một user cụ thể
    const handleUnlockSingleUser = (userId) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: "active" }
                    : user
            )
        );
    };

    // Hàm để khóa một user cụ thể
    const handleLockSingleUser = (userId) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: "locked" }
                    : user
            )
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-bg-app">

            {/* ================= FILTER + ACTIONS ================= */}
            <div className="p-6">
                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-6">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-6 py-3 rounded border border-primary bg-white"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="locked">Đã khóa</option>
                        </select>

                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm người dùng"
                                className="pl-12 pr-4 py-3 rounded text-white focus:outline-none"
                                style={{ backgroundColor: "#7D5B4F", minWidth: "320px" }}
                            />
                        </div>
                    </div>

                    {/* RIGHT - Các nút hành động cho nhiều user */}
                    <div className="flex gap-6">
                        <button
                            onClick={unlockUsers}
                            disabled={selectedIds.length === 0}
                            className="px-8 py-3 rounded text-white disabled:opacity-40"
                            style={{ backgroundColor: "#7A4A2E" }}
                        >
                            Mở khóa ({selectedIds.length})
                        </button>
                        <button
                            onClick={lockUsers}
                            disabled={selectedIds.length === 0}
                            className="px-8 py-3 rounded text-white disabled:opacity-40"
                            style={{ backgroundColor: "#DE6767" }}
                        >
                            Khóa ({selectedIds.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= TABLE HEADER ================= */}
            <div className="grid grid-cols-[40px_2.2fr_1.7fr_1.5fr_1.5fr_250px] text-white px-4 py-4 rounded-t-lg"
                style={{ backgroundColor: "#7A4A2E" }}>
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    style={{ accentColor: '#494949' }}
                />
                <div>Tên người dùng</div>
                <div>Email</div>
                <div>Ngày tham gia</div>
                <div>Trạng thái</div>
                <div className="text-right pr-4">Thao tác</div>
            </div>

            {/* ================= TABLE BODY ================= */}
            {currentItems.map((user) => (
                <div
                    key={user.id}
                    className="grid grid-cols-[40px_2fr_2fr_1.5fr_1.5fr_250px] px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50 transition cursor-pointer"
                    onClick={(e) => handleRowClick(user, e)}
                >
                    {/* Checkbox - cần stopPropagation để không mở modal khi click */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={selectedUsers[user.id] || false}
                            onChange={(e) => toggleUser(user.id, e.target.checked)}
                            style={{ accentColor: '#7A4A2E' }}
                            className="h-5 w-5 cursor-pointer"
                        />
                    </div>

                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-gray-600">{user.email}</div>
                    <div className="text-gray-600">{user.date}</div>

                    <div>
                        <span
                            className={`px-4 py-2 rounded text-white text-sm ${user.status === "active" ? "bg-black" : "bg-red-500"
                                }`}
                        >
                            {user.status === "active" ? "Hoạt động" : "Khóa"}
                        </span>
                    </div>

                    {/* ================= ACTIONS COLUMN ================= */}
                    {/* Container cho các nút hành động - cần stopPropagation */}
                    <div
                        className="flex justify-end gap-3 actions-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Các nút hành động cho từng user */}
                        <div className="flex gap-2">
                            {user.status === "locked" ? (
                                <button
                                    onClick={() => handleUnlockSingleUser(user.id)}
                                    className="px-4 py-2.5 text-sm rounded text-white hover:opacity-90 transition"
                                    style={{ backgroundColor: "#7A4A2E", minWidth: "80px" }}
                                >
                                    Mở khóa
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleLockSingleUser(user.id)}
                                    className="px-4 py-2.5 text-sm rounded text-white hover:opacity-90 transition"
                                    style={{ backgroundColor: "#DE6767", minWidth: "80px" }}
                                >
                                    Khóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* ================= PAGINATION ================= */}
            <div className="mt-auto p-6 flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* ================= USER DETAIL MODAL ================= */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
}