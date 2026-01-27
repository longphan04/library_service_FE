// ==========================================
// Component: EditProfileModal
// Mô tả: Modal chỉnh sửa thông tin cá nhân
// Vị trí: src/components/ui/EditProfileModal.jsx
// ==========================================

import { useState } from 'react';
import { X, Eye, EyeOff, User as UserIcon, Mail, Lock, Camera } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên không được để trống';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (formData.password) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu';
            }
            if (formData.password.length < 6) {
                newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const updatedData = {
                name: formData.name,
                email: formData.email,
            };

            if (formData.password) {
                updatedData.currentPassword = formData.currentPassword;
                updatedData.password = formData.password;
            }

            onSave(updatedData);
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: userData?.name || '',
            email: userData?.email || '',
            password: '',
            currentPassword: '',
            confirmPassword: '',
        });
        setErrors({});
        setErrors({});
        setShowCurrentPassword(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                {/* Header */}
                <div className="bg-linear-to-b from-primary/5 to-transparent pt-8 pb-6 px-6">
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <img
                                src={userData?.avatarUrl}
                                alt={userData?.name}
                                className="w-full h-full rounded-full object-cover ring-4 ring-pink-200"
                            />
                            <button
                                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-hover transition-colors"
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">
                            Chỉnh sửa thông tin
                        </h2>
                        <p className="text-sm text-text-sub">
                            Cập nhật thông tin cá nhân của bạn
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            <UserIcon size={16} className="inline mr-1" />
                            Tên
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên của bạn"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            <Mail size={16} className="inline mr-1" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password Section Title */}
                    <div className="pt-2 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">Đổi mật khẩu (Tùy chọn)</h3>
                    </div>

                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            <Lock size={16} className="inline mr-1" />
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu hiện tại nếu muốn đổi mật khẩu"
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            <Lock size={16} className="inline mr-1" />
                            Mật khẩu mới (tùy chọn)
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu mới"
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            <Lock size={16} className="inline mr-1" />
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu mới"
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-colors shadow-md"
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
