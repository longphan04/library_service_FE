// ==========================================
// Component: Register
// Mô tả: Trang đăng ký tài khoản cho người dùng mới
// Vị trí: src/pages/auth/Register.jsx
// ==========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../componants/ui/Index';
import InputField from '../../componants/ui/InputField';

// Import icons từ assets
import { UserIcon, EmailIcon, LockIcon } from '../../assets/icons';

// Import logo từ assets
import Logo from '../../assets/icons/logo.png';

// ==========================================
// Constants
// Mô tả: Các hằng số dùng trong validation
// ==========================================
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// Register Component
// ==========================================
const Register = () => {
    // ==========================================
    // State Management
    // Mô tả: Quản lý giá trị các trường trong form đăng ký
    // ==========================================
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // State lưu trữ thông báo lỗi cho từng trường
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // State quản lý trạng thái loading khi submit form
    const [isLoading, setIsLoading] = useState(false);

    // ==========================================
    // Computed Values
    // Mô tả: Kiểm tra xem button có nên bị disabled không
    // Button disabled khi đang loading hoặc có trường rỗng
    // ==========================================
    const isButtonDisabled =
        isLoading ||
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.password.trim() ||
        !formData.confirmPassword.trim();

    // ==========================================
    // Validation Functions
    // Mô tả: Các hàm kiểm tra tính hợp lệ của dữ liệu
    // ==========================================

    // Kiểm tra email có đúng định dạng không
    const validateEmail = (email) => {
        if (!email.trim()) {
            return 'Email không được để trống';
        }
        if (!EMAIL_REGEX.test(email)) {
            return 'Email không đúng định dạng';
        }
        return '';
    };

    // Kiểm tra tên có hợp lệ không
    const validateName = (name) => {
        if (!name.trim()) {
            return 'Tên không được để trống';
        }
        if (name.trim().length < 2) {
            return 'Tên phải có ít nhất 2 ký tự';
        }
        return '';
    };

    // Kiểm tra mật khẩu có hợp lệ không
    const validatePassword = (password) => {
        if (!password.trim()) {
            return 'Mật khẩu không được để trống';
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`;
        }
        return '';
    };

    // Kiểm tra xác nhận mật khẩu có khớp không
    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword.trim()) {
            return 'Xác nhận mật khẩu không được để trống';
        }
        if (confirmPassword !== password) {
            return 'Mật khẩu xác nhận không khớp';
        }
        return '';
    };

    // Validate toàn bộ form trước khi submit
    const validateForm = () => {
        const newErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
        };

        setErrors(newErrors);

        // Trả về true nếu không có lỗi nào
        return !Object.values(newErrors).some(error => error !== '');
    };

    // ==========================================
    // Event Handlers
    // ==========================================

    // Xử lý khi người dùng thay đổi giá trị input
    const handleInputChange = (field) => (e) => {
        const value = e.target.value;

        // Cập nhật giá trị trong formData
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Xóa lỗi của trường đang nhập khi user bắt đầu sửa
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Xử lý khi người dùng submit form đăng ký
    const handleSubmit = async (e) => {
        // Ngăn chặn hành vi mặc định của form (reload trang)
        e.preventDefault();

        // Validate form trước khi submit
        if (!validateForm()) {
            return;
        }

        // Bật trạng thái loading
        setIsLoading(true);

        // TODO: Gọi API đăng ký thông qua service
        // Giả lập thời gian xử lý API
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Logic xử lý đăng ký sẽ được thêm sau
            // Ví dụ: await authService.register(formData);

        } catch (error) {
            // Xử lý lỗi từ API
            setErrors(prev => ({
                ...prev,
                email: 'Đã có lỗi xảy ra, vui lòng thử lại'
            }));
        } finally {
            // Tắt trạng thái loading
            setIsLoading(false);
        }
    };

    // ==========================================
    // Render Component
    // ==========================================
    return (
        // Container chính - background toàn màn hình
        <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
            {/* Card đăng ký - Container form */}
            <div className="w-full max-w-md bg-bg-section rounded-2xl shadow-lg p-8 md:p-10">

                {/* ==========================================
                    Header Section
                    Mô tả: Logo và tên ứng dụng
                ========================================== */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {/* Logo */}
                    <img
                        src={Logo}
                        alt="Library System Logo"
                        className="w-10 h-10 object-contain"
                    />
                    {/* Tên ứng dụng */}
                    <h1 className="text-xl font-semibold text-primary">
                        Library system
                    </h1>
                </div>

                {/* ==========================================
                    Form Section
                    Mô tả: Form đăng ký với các trường thông tin
                ========================================== */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Trường nhập tên */}
                    <InputField
                        id="name"
                        label="Tên"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        placeholder="Nhập tên của bạn"
                        icon={<UserIcon />}
                        error={errors.name}
                        disabled={isLoading}
                    />

                    {/* Trường nhập email */}
                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        placeholder="Nhập email"
                        icon={<EmailIcon />}
                        error={errors.email}
                        disabled={isLoading}
                    />

                    {/* Trường nhập mật khẩu */}
                    <InputField
                        id="password"
                        label="Mật khẩu"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        placeholder="Đặt mật khẩu"
                        icon={<LockIcon />}
                        error={errors.password}
                        disabled={isLoading}
                    />

                    {/* Trường xác nhận mật khẩu */}
                    <InputField
                        id="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        placeholder="Xác nhận mật khẩu của bạn"
                        icon={<LockIcon />}
                        error={errors.confirmPassword}
                        disabled={isLoading}
                    />

                    {/* ==========================================
                        Submit Button
                        Mô tả: Nút tạo tài khoản sử dụng Button component chung
                        - Disabled khi đang loading hoặc form không hợp lệ
                        - Hiển thị trạng thái loading khi đang xử lý
                    ========================================== */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            fullWidth
                            disabled={isButtonDisabled}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản của bạn'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
