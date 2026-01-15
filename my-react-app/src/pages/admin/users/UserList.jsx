import { Pencil } from "lucide-react";
import { useState } from "react";

import Modal from "@/components/admin/modal/Modal";
import ActionButton from "@/components/admin/ui/ActionButton";

export default function UserList() {
    const [openActionModal, setOpenActionModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const users = [
        {
            id: 1,
            name: "Cuocsongcodon",
            email: "abc@gmail.com",
            joined: "29-12-2025",
            status: "active",
        },
        {
            id: 2,
            name: "soidondoc",
            email: "abc11@gmail.com",
            joined: "15-11-2025",
            status: "blocked",
        },
    ];

    return (
        <div className="relative w-full bg-[#F6EFE7]">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 text-gray-800 mb-12 text-center">
                Quản lý người dùng
            </h1>

            {/* SEARCH */}
            <div className="max-w-4xl mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    className="w-full px-4 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                />
            </div>

            {/* TABLE */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr className="text-gray-700">
                            <th className="px-6 py-4 font-medium">Tên</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">
                                Ngày tham gia
                            </th>
                            <th className="px-6 py-4 font-medium text-center w-55">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b last:border-none hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.joined}</td>

                                <td className="px-6 py-4 relative">
                                    {/* STATUS */}
                                    <div
                                        className="absolute left-1/2 top-1/2
                                        -translate-x-1/2 -translate-y-1/2"
                                    >
                                        <span
                                            className={`w-22.5 h-7
                                            flex items-center justify-center
                                            rounded-[14px] text-sm text-white
                                            ${user.status === "active"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                }`}
                                        >
                                            {user.status === "active"
                                                ? "Hoạt động"
                                                : "Bị khóa"}
                                        </span>
                                    </div>

                                    {/* EDIT */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setOpenActionModal(true);
                                            }}
                                            className="p-2 rounded hover:bg-gray-200 transition"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL: CHỌN HÀNH ĐỘNG */}
            <Modal
                open={openActionModal}
                onClose={() => setOpenActionModal(false)}
            >
                <h2 className="text-xl font-semibold text-center mb-10">
                    Điều chỉnh trạng thái
                </h2>

                <div className="flex gap-6">
                    <ActionButton
                        variant="success"
                        className="flex-1 justify-center text-lg"
                        onClick={() => {
                            setPendingStatus("active");
                            setOpenActionModal(false);
                            setOpenConfirmModal(true);
                        }}
                    >
                        Mở khóa
                    </ActionButton>

                    <ActionButton
                        variant="danger"
                        className="flex-1 justify-center text-lg"
                        onClick={() => {
                            setPendingStatus("blocked");
                            setOpenActionModal(false);
                            setOpenConfirmModal(true);
                        }}
                    >
                        Khóa
                    </ActionButton>
                </div>
            </Modal>

            {/* MODAL: XÁC NHẬN */}
            <Modal
                open={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
            >
                <h2 className="text-xl font-semibold text-center mb-10">
                    Xác nhận thay đổi
                </h2>

                <div className="flex gap-6">
                    <ActionButton
                        variant="success"
                        className="flex-1 justify-center text-lg"
                        onClick={() => {
                            // 👉 sau này gắn API update status
                            setOpenConfirmModal(false);
                        }}
                    >
                        Xác nhận
                    </ActionButton>

                    <ActionButton
                        className="flex-1 justify-center text-lg"
                        onClick={() => setOpenConfirmModal(false)}
                    >
                        Hủy
                    </ActionButton>
                </div>
            </Modal>
        </div>
    );
}
