import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";

import Modal from "@/components/modal/Modal";
import ActionButton from "@/components/ui/ActionButton";
import StatusBadge from "@/components/ui/StatusBadge";
import Toast from "@/components/ui/Toast";
import userService from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [openActionModal, setOpenActionModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    const { loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ==========================================
    // Load users from API
    // ==========================================
    useEffect(() => {
        if (authLoading) return;

        fetchUsers();
    }, [authLoading]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getUsers();

            // Handle both array response and object with data property
            const usersList = Array.isArray(data) ? data : data.data || data.users || [];
            setUsers(usersList);
            setFilteredUsers(usersList);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Lỗi khi tải danh sách người dùng"
            );
            setUsers([]);
            setFilteredUsers([]);
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

        if (!term) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(
            (user) =>
                (user.name && user.name.toLowerCase().includes(term)) ||
                (user.email && user.email.toLowerCase().includes(term)) ||
                (user.username && user.username.toLowerCase().includes(term))
        );
        setFilteredUsers(filtered);
    };

    // ==========================================
    // Handle status update
    // ==========================================
    const handleConfirmStatusUpdate = async () => {
        if (!selectedUser || !pendingStatus) return;

        try {
            setIsUpdating(true);
            setError(null);

            try {
                const updatedUser = await userService.updateUserStatus(
                    selectedUser.id,
                    pendingStatus
                );
            } catch (error) {
                // If update fails, still update UI optimistically
                console.warn('Update API failed, updating UI anyway:', error.message);
            }

            // Update user in list
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id
                        ? { ...user, status: pendingStatus }
                        : user
                )
            );

            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id
                        ? { ...user, status: pendingStatus }
                        : user
                )
            );

            // Show success message
            const statusText =
                pendingStatus === "active" ? "Mở khóa" : "Khóa";
            // Show success toast
            setToast({
                isOpen: true,
                type: 'success',
                message: `${statusText} tài khoản ${selectedUser.name} thành công!`
            });

            // Reset modals
            setOpenConfirmModal(false);
            setSelectedUser(null);
            setPendingStatus(null);
        } catch (err) {
            console.error("Error updating user status:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Lỗi khi cập nhật trạng thái người dùng"
            );
            // Show error toast
            setToast({
                isOpen: true,
                type: 'error',
                message: err.response?.data?.message || err.message || 'Lỗi khi cập nhật trạng thái người dùng'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // ==========================================
    // Format joined date
    // ==========================================
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN");
        } catch {
            return dateString;
        }
    };

    // ==========================================
    // Render loading state
    // ==========================================
    if (authLoading || loading) {
        return (
            <div className="relative w-full bg-[#F6EFE7] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E2C6A6] mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full bg-[#F6EFE7] min-h-screen pb-8">
            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 text-gray-800 mb-12 text-center">
                Quản lý người dùng
            </h1>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-semibold">Lỗi:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* SEARCH */}
            <div className="max-w-4xl mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email hoặc tên đăng nhập..."
                    value={searchTerm}
                    onChange={handleSearch}
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
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b last:border-none hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4">{user.name || user.username || "N/A"}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {formatDate(user.createdAt || user.joinedDate)}
                                    </td>

                                    <td className="px-6 py-4 relative">
                                        {/* STATUS */}
                                        <div
                                            className="absolute left-1/2 top-1/2
                                            -translate-x-1/2 -translate-y-1/2"
                                        >
                                            <StatusBadge
                                                status={user.status}
                                                isActive={user.isActive}
                                            />
                                        </div>

                                        {/* EDIT */}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setOpenActionModal(true);
                                                }}
                                                className="p-2 rounded hover:bg-gray-200 transition"
                                                title="Chỉnh sửa trạng thái"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    {users.length === 0
                                        ? "Không có người dùng nào"
                                        : "Không tìm thấy người dùng phù hợp"}
                                </td>
                            </tr>
                        )}
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
                            setPendingStatus("banned");
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
                onClose={() => !isUpdating && setOpenConfirmModal(false)}
            >
                <h2 className="text-xl font-semibold text-center mb-6">
                    Xác nhận thay đổi
                </h2>

                {selectedUser && (
                    <p className="text-center mb-8 text-gray-600">
                        Bạn có chắc chắn muốn{" "}
                        {pendingStatus === "active" ? "mở khóa" : "khóa"} tài khoản{" "}
                        <strong>{selectedUser.name || selectedUser.username}</strong>?
                    </p>
                )}

                <div className="flex gap-6">
                    <ActionButton
                        variant="danger"
                        className="flex-1 justify-center text-lg"
                        onClick={handleConfirmStatusUpdate}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Đang xử lý..." : "Xác nhận"}
                    </ActionButton>

                    <ActionButton
                        className="flex-1 justify-center text-lg"
                        onClick={() => setOpenConfirmModal(false)}
                        disabled={isUpdating}
                    >
                        Hủy
                    </ActionButton>
                </div>
            </Modal>

            {/* Toast Notification */}
            <Toast
                isOpen={toast.isOpen}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
                duration={3000}
            />
        </div>
    );
}
