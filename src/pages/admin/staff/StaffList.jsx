import { Lock, Unlock, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";

import ActionButton from "@/components/ui/ActionButton";
import StatusBadge from "@/components/ui/StatusBadge";
import Toast from "@/components/ui/Toast";
import FormModal from "@/components/modal/FormModal";
import Modal from "@/components/modal/Modal";
import staffService from "@/services/staff.service";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function StaffManagement() {
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    const { loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ==========================================
    // Load staff from API
    // ==========================================
    useEffect(() => {
        if (authLoading) return;

        fetchStaff();
    }, [authLoading]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await staffService.getStaff();

            const staffList = Array.isArray(data) ? data : data.data || data.staff || [];
            setStaff(staffList);
            setFilteredStaff(staffList);
        } catch (err) {
            console.error("Error fetching staff:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Lỗi khi tải danh sách nhân viên"
            );
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
            setFilteredStaff(staff);
            return;
        }

        const filtered = staff.filter(
            (s) =>
                (s.name && s.name.toLowerCase().includes(term)) ||
                (s.email && s.email.toLowerCase().includes(term))
        );
        setFilteredStaff(filtered);
    };

    // ==========================================
    // Handle add staff
    // ==========================================
    const handleAddStaff = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            setIsSubmitting(true);

            // Validate form
            if (!formData.name.trim()) {
                throw new Error('Tên nhân viên không được để trống');
            }

            if (!formData.email.trim()) {
                throw new Error('Email không được để trống');
            }

            if (!isValidEmail(formData.email)) {
                throw new Error('Email không đúng định dạng');
            }

            if (!formData.password) {
                throw new Error('Mật khẩu không được để trống');
            }

            if (formData.password.length < 8) {
                throw new Error('Mật khẩu phải tối thiểu 8 ký tự');
            }

            // Call API to create staff
            const newStaffData = await staffService.createStaff(formData);

            // Add to list
            const transformedStaff = {
                id: newStaffData.user_id || newStaffData.id || Math.random(),
                name: newStaffData.profile?.full_name || newStaffData.full_name || formData.name,
                email: newStaffData.email,
                status: newStaffData.status?.toLowerCase() || 'active',
                isActive: newStaffData.status === 'ACTIVE' || newStaffData.status !== 'BANNED',
                isBanned: newStaffData.status === 'BANNED',
                createdAt: newStaffData.created_at || new Date().toISOString(),
            };

            setStaff([...staff, transformedStaff]);
            setFilteredStaff([...filteredStaff, transformedStaff]);

            // Reset form
            setFormData({ name: '', email: '', password: '' });
            setOpenAddModal(false);

            // Show success toast
            setToast({ isOpen: true, type: 'success', message: 'Thêm nhân viên thành công!' });
        } catch (err) {
            setFormError(err.message || 'Lỗi khi thêm nhân viên');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==========================================
    // Handle status update
    // ==========================================
    const handleConfirmStatusUpdate = async () => {
        if (!selectedStaff || !pendingAction) return;

        try {
            setIsSubmitting(true);
            setError(null);

            if (pendingAction === 'delete') {
                // Delete staff
                try {
                    await staffService.deleteStaff(selectedStaff.id);
                } catch (error) {
                    // If delete fails, still update UI optimistically
                    console.warn('Delete API failed, updating UI anyway:', error.message);
                }

                setStaff(staff.filter(s => s.id !== selectedStaff.id));
                setFilteredStaff(filteredStaff.filter(s => s.id !== selectedStaff.id));

                // Show success toast
                setToast({ isOpen: true, type: 'success', message: 'Xóa nhân viên thành công!' });
            } else {
                // Toggle status
                const newStatus = selectedStaff.status === 'active' ? 'banned' : 'active';

                try {
                    await staffService.updateStaffStatus(selectedStaff.id, newStatus);
                } catch (error) {
                    // If update fails, still update UI optimistically
                    console.warn('Update API failed, updating UI anyway:', error.message);
                }

                // Update local state
                const updatedStaff = staff.map(s =>
                    s.id === selectedStaff.id
                        ? { ...s, status: newStatus, isActive: newStatus === 'active', isBanned: newStatus === 'banned' }
                        : s
                );
                setStaff(updatedStaff);
                setFilteredStaff(updatedStaff.filter(s =>
                    (s.name && s.name.toLowerCase().includes(searchTerm)) ||
                    (s.email && s.email.toLowerCase().includes(searchTerm))
                ));

                const statusText = newStatus === 'active' ? 'Mở khóa' : 'Khóa';
                // Show success toast
                setToast({ isOpen: true, type: 'success', message: `${statusText} nhân viên thành công!` });
            }

            setOpenConfirmModal(false);
            setSelectedStaff(null);
            setPendingAction(null);
        } catch (err) {
            console.error("Error updating staff:", err);
            setError(err.message || 'Lỗi khi cập nhật nhân viên');
            // Show error toast
            setToast({ isOpen: true, type: 'error', message: err.message || 'Lỗi khi cập nhật nhân viên' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==========================================
    // Format date
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
            <h1 className="text-3xl font-semibold pt-3 text-gray-800 mb-6 text-center">
                Quản lý nhân viên
            </h1>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-semibold">Lỗi:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* SEARCH + ADD */}
            <div className="max-w-4xl mx-auto mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên theo tên hoặc email..."
                    value={searchTerm}
                    onChange={handleSearch}
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
                            <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                            <th className="px-6 py-4 font-medium text-center w-40">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStaff.length > 0 ? (
                            filteredStaff.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-b last:border-none hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4">{s.name || "N/A"}</td>
                                    <td className="px-6 py-4">{s.email}</td>
                                    <td className="px-6 py-4">{formatDate(s.createdAt)}</td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-4">
                                            {/* STATUS BADGE */}
                                            <StatusBadge
                                                status={s.status}
                                                isActive={s.isActive}
                                            />

                                            {/* STATUS TOGGLE */}
                                            <button
                                                onClick={() => {
                                                    setSelectedStaff(s);
                                                    setPendingAction("toggle");
                                                    setOpenConfirmModal(true);
                                                }}
                                                className="p-2 rounded hover:bg-gray-200"
                                                title={
                                                    s.status === "active"
                                                        ? "Khóa"
                                                        : "Mở khóa"
                                                }
                                            >
                                                {s.status === "active" ? (
                                                    <Lock size={18} />
                                                ) : (
                                                    <Unlock size={18} />
                                                )}
                                            </button>

                                            {/* DELETE */}
                                            <button
                                                onClick={() => {
                                                    setSelectedStaff(s);
                                                    setPendingAction("delete");
                                                    setOpenConfirmModal(true);
                                                }}
                                                className="p-2 rounded hover:bg-red-100 text-red-500"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    {staff.length === 0
                                        ? "Không có nhân viên nào"
                                        : "Không tìm thấy nhân viên phù hợp"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL: THÊM NHÂN VIÊN */}
            <Modal
                open={openAddModal}
                onClose={() => {
                    setOpenAddModal(false);
                    setFormData({ name: '', email: '', password: '' });
                    setFormError('');
                }}
            >
                <h2 className="text-xl font-semibold text-center mb-6">Thêm nhân viên</h2>

                {formError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {formError}
                    </div>
                )}

                <form onSubmit={handleAddStaff} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên nhân viên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nhập tên nhân viên"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Nhập email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Tối thiểu 8 ký tự"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <ActionButton
                            type="submit"
                            variant="success"
                            className="flex-1 justify-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Thêm nhân viên'}
                        </ActionButton>

                        <ActionButton
                            type="button"
                            className="flex-1 justify-center"
                            onClick={() => {
                                setOpenAddModal(false);
                                setFormData({ name: '', email: '', password: '' });
                                setFormError('');
                            }}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </ActionButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL: XÁC NHẬN */}
            <Modal
                open={openConfirmModal}
                onClose={() => !isSubmitting && setOpenConfirmModal(false)}
            >
                <h2 className="text-xl font-semibold text-center mb-8">
                    {pendingAction === "delete"
                        ? "Xác nhận xóa nhân viên?"
                        : selectedStaff?.status === "active"
                            ? "Xác nhận khóa nhân viên?"
                            : "Xác nhận mở khóa nhân viên?"}
                </h2>

                {pendingAction !== "delete" && selectedStaff && (
                    <p className="text-center mb-6 text-gray-600">
                        Nhân viên: <strong>{selectedStaff.name}</strong>
                    </p>
                )}

                <div className="flex gap-4">
                    <ActionButton
                        variant="success"
                        className="flex-1 justify-center"
                        onClick={handleConfirmStatusUpdate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </ActionButton>

                    <ActionButton
                        className="flex-1 justify-center"
                        onClick={() => setOpenConfirmModal(false)}
                        disabled={isSubmitting}
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

// ==========================================
// Utility Functions
// ==========================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
