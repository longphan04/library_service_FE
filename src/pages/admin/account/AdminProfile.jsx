import { Pencil } from "lucide-react";
import { useState } from "react";

import Modal from "@/componants/modal/Modal";
import ActionButton from "@/componants/ui/ActionButton";

export default function AdminProfile() {
    const [openEditModal, setOpenEditModal] = useState(false);

    const [form, setForm] = useState({
        name: "admin123",
        email: "01234567890",
    });

    return (
        <div className="relative w-full bg-[#F6EFE7]">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 mb-6 text-center">
                Quản lý tài khoản
            </h1>

            {/* PROFILE CARD */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
                <div className="flex justify-between items-start">
                    <div className="flex gap-6">
                        <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-4xl text-purple-700">👤</span>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {form.name}
                            </h2>
                            <p className="text-gray-500">{form.email}</p>
                            <span className="inline-block mt-2 px-4 py-1 bg-gray-200 rounded-full text-sm">
                                Administrator
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpenEditModal(true)}
                        className="flex items-center gap-2 px-4 py-2
                        bg-[#E2C6A6] rounded-lg hover:opacity-90"
                    >
                        <Pencil size={18} />
                        Edit Profile
                    </button>
                </div>

                <hr className="my-6" />

                <div className="space-y-4 text-lg">
                    <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">{form.name}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{form.email}</p>
                    </div>
                </div>
            </div>

            {/* MODAL: CHỈNH SỬA */}
            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
            >
                <h2 className="text-xl font-semibold text-center mb-6">
                    Chỉnh sửa thông tin
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Tên"
                        className="w-full px-4 py-3 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                    />

                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        placeholder="Email / Số điện thoại"
                        className="w-full px-4 py-3 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                    />
                </div>

                <div className="flex gap-6 mt-8">
                    <ActionButton
                        variant="success"
                        className="flex-1 justify-center"
                        onClick={() => {
                            // 👉 sau này gắn API update profile
                            setOpenEditModal(false);
                        }}
                    >
                        Xác nhận
                    </ActionButton>

                    <ActionButton
                        className="flex-1 justify-center"
                        onClick={() => setOpenEditModal(false)}
                    >
                        Hủy
                    </ActionButton>
                </div>
            </Modal>
        </div>
    );
}
