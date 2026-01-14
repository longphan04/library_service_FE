import { useState } from "react";
import Pagination from "../components/Pagination";
import useUserManagement from "../hooks/useUserManagement";
import UserDetailModal from "../components/UserDetailModal/UserDetailModal";
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
    } = useUserManagement(usersData);

    const handleSaveUser = (updatedUser) => {
        setUsers(prev =>
            prev.map(u =>
                u.id === updatedUser.id ? updatedUser : u
            )
        );
    };

    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="min-h-screen flex flex-col bg-[#F5EBE0]">

            {/* ================= FILTER + ACTIONS ================= */}
            <div className="p-6">
                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-6">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-6 py-3 rounded border border-[#7A4A2E] bg-white"
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

                    {/* RIGHT */}
                    <div className="flex gap-6">
                        <button
                            onClick={unlockUsers}
                            disabled={selectedIds.length === 0}
                            className="px-8 py-3 rounded text-white disabled:opacity-40"
                            style={{ backgroundColor: "#7A4A2E" }}
                        >
                            Mở khóa
                        </button>
                        <button
                            onClick={lockUsers}
                            disabled={selectedIds.length === 0}
                            className="px-8 py-3 rounded text-white disabled:opacity-40"
                            style={{ backgroundColor: "#DE6767" }}
                        >
                            Khóa
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= TABLE HEADER ================= */}
            <div className="bg-[#7A4A2E] text-white px-4 py-3 grid grid-cols-[40px_2fr_2fr_1.5fr_1.5fr_40px] items-center">
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
                <div />
            </div>

            {/* ================= TABLE BODY ================= */}
            {currentItems.map((user) => (
                <div
                    key={user.id}
                    className="grid grid-cols-[40px_2fr_2fr_1.5fr_1.5fr_40px] px-4 py-3 items-center border-b"
                >
                    <input
                        type="checkbox"
                        checked={selectedUsers[user.id] || false}
                        onChange={(e) => toggleUser(user.id, e.target.checked)}
                        style={{ accentColor: '#7A4A2E' }}
                    />

                    <div className="font-medium">{user.name}</div>
                    <div>{user.email}</div>
                    <div>{user.date}</div>

                    <div>
                        <span
                            className={`px-5 py-1 rounded text-white text-sm ${user.status === "active" ? "bg-black" : "bg-red-500"
                                }`}
                        >
                            {user.status === "active" ? "Hoạt động" : "Khóa"}
                        </span>
                    </div>

                    {/* 3 DOT MENU */}
                    <div
                        className="cursor-pointer text-xl"
                        onClick={() => setSelectedUser(user)}
                    >
                        ⋯
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
