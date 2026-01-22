import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";

import Modal from "@/components/modal/Modal";
import ActionButton from "@/components/ui/ActionButton";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import userService from "@/services/user.service";
import authService from "@/services/auth.service";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminProfile() {
    const { user, updateUser } = useAuth();

    const [openEditModal, setOpenEditModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Original data to reset on cancel
    const [originalData, setOriginalData] = useState({
        name: "",
    });

    // Error state
    const [formErrors, setFormErrors] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Store email separately (read-only)
    const [email, setEmail] = useState("");

    // Toast state
    const [toast, setToast] = useState({ isOpen: false, type: '', message: '' });

    // Load user data from AuthContext
    useEffect(() => {
        if (user) {
            // Try to get name from profile first, then fallback to other fields
            const userName = user.profile?.full_name || user.fullName || user.full_name || user.name || "";
            const userEmail = user.email || "";

            setFormData(prev => ({ ...prev, name: userName }));
            setOriginalData({ name: userName });
            setEmail(userEmail);
        }
    }, [user]);

    // Validation functions
    const validateName = (name) => {
        if (!name.trim()) {
            return 'Tên không được để trống';
        }
        if (name.trim().length < 2) {
            return 'Tên phải có ít nhất 2 ký tự';
        }
        return '';
    };



    const validatePassword = (password) => {
        if (!password.trim()) {
            return 'Mật khẩu không được để trống';
        }
        if (password.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        return '';
    };

    const validateForm = () => {
        const errors = {
            name: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };

        // Always validate name (required)
        errors.name = validateName(formData.name);

        // Always validate current password (required)
        if (!formData.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }

        // Check if user wants to change password (new password or confirm password filled)
        const isChangingPassword = formData.newPassword || formData.confirmPassword;

        if (isChangingPassword) {
            // If changing password, validate new password fields
            if (!formData.newPassword) {
                errors.newPassword = 'Vui lòng nhập mật khẩu mới';
            } else {
                errors.newPassword = validatePassword(formData.newPassword);
            }
            if (!formData.confirmPassword) {
                errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
            } else if (formData.newPassword !== formData.confirmPassword) {
                errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        setFormErrors(errors);
        return !errors.name && !errors.currentPassword && !errors.newPassword && !errors.confirmPassword;
    };

    // Handle input change
    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user types
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle form submit
    const handleSubmit = async () => {
        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Check if user wants to change password (new password filled)
            const isChangingPassword = formData.newPassword && formData.confirmPassword;
            const isChangingName = formData.name !== originalData.name;
            let nameUpdateSuccess = false;
            let passwordUpdateSuccess = false;

            // First, verify current password by attempting to change it
            // If not changing password, we still need to verify current password is correct
            if (isChangingPassword) {
                // Change password
                await authService.changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                });
                passwordUpdateSuccess = true;
            } else {
                // Just verify current password without changing it
                // We'll do this by attempting to update the profile
                // If password is wrong, the API will return an error
            }

            // Update name if changed
            if (isChangingName) {
                const profileData = await userService.updateMe({
                    full_name: formData.name,
                });
                nameUpdateSuccess = true;

                // Update user data in AuthContext with the returned profile data
                updateUser({
                    profile: profileData,
                    fullName: profileData.full_name,
                    full_name: profileData.full_name,
                    name: profileData.full_name,
                });

                // Update original data
                setOriginalData({
                    name: formData.name,
                });
            }

            // Reset password fields after successful update
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));

            // Close modal
            setOpenEditModal(false);

            // Show success toast
            let message = '';
            if (nameUpdateSuccess && passwordUpdateSuccess) {
                message = 'Cập nhật tên và mật khẩu thành công!';
            } else if (nameUpdateSuccess) {
                message = 'Cập nhật tên thành công!';
            } else if (passwordUpdateSuccess) {
                message = 'Cập nhật mật khẩu thành công!';
            } else {
                message = 'Xác thực thành công!';
            }

            setToast({
                isOpen: true,
                type: 'success',
                message: message
            });

        } catch (error) {
            console.error('Error updating profile:', error);

            // Show error toast
            setToast({
                isOpen: true,
                type: 'error',
                message: error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại!'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        // Reset form to original data
        setFormData({
            ...originalData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setFormErrors({
            name: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setOpenEditModal(false);
    };

    return (
        <div className="relative w-full bg-[#F6EFE7] min-h-screen pb-8">

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
                                {formData.name || 'Admin'}
                            </h2>
                            <p className="text-gray-500">{email || 'No email'}</p>
                            <span className="inline-block mt-2 px-4 py-1 bg-gray-200 rounded-full text-sm">
                                Administrator
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpenEditModal(true)}
                        className="flex items-center gap-2 px-4 py-2
                        bg-[#E2C6A6] rounded-lg hover:opacity-90 transition"
                    >
                        <Pencil size={18} />
                        Edit Profile
                    </button>
                </div>

                <hr className="my-6" />

                <div className="space-y-4 text-lg">
                    <div>
                        <p className="text-gray-500">Tên</p>
                        <p className="font-medium">{formData.name || 'Chưa cập nhật'}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{email || 'Chưa cập nhật'}</p>
                    </div>
                </div>
            </div>

            {/* MODAL: CHỈNH SỬA */}
            <Modal
                open={openEditModal}
                onClose={handleCancel}
            >
                <h2 className="text-xl font-semibold text-center mb-6">
                    Chỉnh sửa thông tin
                </h2>

                <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            placeholder="Nhập tên"
                            className={`w-full px-4 py-3 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]
                            ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={isSubmitting}
                        />
                        {formErrors.name && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                        )}
                    </div>

                    {/* Divider */}
                    <hr className="my-4" />

                    {/* Password Section Header */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Đổi mật khẩu (Tùy chọn)
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                            Để trống nếu không muốn thay đổi mật khẩu
                        </p>
                    </div>

                    {/* Current Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange('currentPassword')}
                            placeholder="Nhập mật khẩu hiện tại"
                            className={`w-full px-4 py-3 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]
                            ${formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={isSubmitting}
                        />
                        {formErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange('newPassword')}
                            placeholder="Nhập mật khẩu mới"
                            className={`w-full px-4 py-3 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]
                            ${formErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={isSubmitting}
                        />
                        {formErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            placeholder="Nhập lại mật khẩu mới"
                            className={`w-full px-4 py-3 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-[#E2C6A6]
                            ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={isSubmitting}
                        />
                        {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-6 mt-8">
                    <ActionButton
                        variant="success"
                        className="flex-1 justify-center"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
                    </ActionButton>

                    <ActionButton
                        className="flex-1 justify-center"
                        onClick={handleCancel}
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
