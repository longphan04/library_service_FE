import { Lock, Unlock, Trash2 } from "lucide-react";
import { useState } from "react";

import ActionButton from "@/components/admin/ui/ActionButton";
import FormModal from "@/components/admin/modal/FormModal";
import Modal from "@/components/admin/modal/Modal";

export default function StaffManagement() {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const [staffs, setStaffs] = useState([
        {
            id: 1,
            name: "Nhanvien1",
            email: "nv1@gmail.com",
            joined: "29/12/2025",
            status: "active",
        },
        {
            id: 2,
            name: "Nhanvien2",
            email: "nv2@gmail.com",
            joined: "15/11/2025",
            status: "blocked",
        },
    ]);

    const toggleStatus = () => {
        setStaffs((prev) =>
            prev.map((s) =>
                s.id === selectedStaff.id
                    ? {
                        ...s,
                        status:
                            s.status === "active" ? "blocked" : "active",
                    }
                    : s
            )
        );
        setOpenConfirmModal(false);
    };

    return (
        <div className="relative w-full bg-[#F6EFE7]">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 text-gray-800 mb-6 text-center">
                Quản lý nhân viên
            </h1>

            {/* SEARCH + ADD */}
            <div className="max-w-4xl mx-auto mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    className="flex-1 px-4 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                />

                <ActionButton onClick={() => setOpenAddModal(true)}>
                    + Thêm NV
                </ActionButton>
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
                            <th className="px-6 py-4 font-medium text-center">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 font-medium text-center w-40">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {staffs.map((staff) => (
                            <tr
                                key={staff.id}
                                className="border-b last:border-none hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4">{staff.name}</td>
                                <td className="px-6 py-4">{staff.email}</td>
                                <td className="px-6 py-4">{staff.joined}</td>

                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full text-white
                                        ${staff.status === "active"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {staff.status === "active"
                                            ? "Hoạt động"
                                            : "Bị khóa"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 flex justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedStaff(staff);
                                            setPendingAction("toggle");
                                            setOpenConfirmModal(true);
                                        }}
                                        className="p-2 rounded hover:bg-gray-200"
                                        title={
                                            staff.status === "active"
                                                ? "Khóa"
                                                : "Mở khóa"
                                        }
                                    >
                                        {staff.status === "active" ? (
                                            <Lock size={18} />
                                        ) : (
                                            <Unlock size={18} />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedStaff(staff);
                                            setPendingAction("delete");
                                            setOpenConfirmModal(true);
                                        }}
                                        className="p-2 rounded hover:bg-red-100 text-red-500"
                                        title="Xóa"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL: THÊM NHÂN VIÊN */}
            <FormModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                title="Thêm nhân viên"
                onSubmit={() => setOpenAddModal(false)}
            >
                <input
                    type="text"
                    placeholder="Tên nhân viên"
                    className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full px-4 py-3 border rounded-lg"
                />
            </FormModal>

            {/* MODAL: XÁC NHẬN */}
            <Modal
                open={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
            >
                <h2 className="text-xl font-semibold text-center mb-8">
                    {pendingAction === "delete"
                        ? "Bạn có chắc muốn xóa nhân viên?"
                        : selectedStaff?.status === "active"
                            ? "Xác nhận khóa nhân viên?"
                            : "Xác nhận mở khóa nhân viên?"}
                </h2>

                <div className="flex gap-6">
                    <ActionButton
                        variant="success"
                        className="flex-1 justify-center"
                        onClick={() => {
                            if (pendingAction === "delete") {
                                setStaffs((prev) =>
                                    prev.filter(
                                        (s) => s.id !== selectedStaff.id
                                    )
                                );
                                setOpenConfirmModal(false);
                            } else {
                                toggleStatus();
                            }
                        }}
                    >
                        Xác nhận
                    </ActionButton>

                    <ActionButton
                        className="flex-1 justify-center"
                        onClick={() => setOpenConfirmModal(false)}
                    >
                        Hủy
                    </ActionButton>
                </div>
            </Modal>
        </div>
    );
}
