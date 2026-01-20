// ==========================================
// Component: Login
// Mô tả: Trang đăng nhập cho người dùng
// Vị trí: src/pages/auth/Login.jsx
// ==========================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Index';
import InputField from '../../components/ui/InputField';
import { useAuth } from '../../contexts/AuthContext';

// Import icons từ assets
import { EmailIcon, LockIcon } from '../../assets/icons';

// Import logo từ assets
import Logo from '../../assets/icons/logo.png';

// ==========================================
// Constants
// Mô tả: Các hằng số dùng trong validation
// ==========================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// Login Component
// ==========================================
const Login = () => {
    // Router navigate
    const navigate = useNavigate();

    // Auth context
    const { login: loginFromContext } = useAuth();

    // ==========================================
    // State Management
    // Mô tả: Quản lý giá trị các trường trong form đăng nhập
    // ==========================================
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // State lưu trữ thông báo lỗi cho từng trường
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    // State lưu trữ thông báo lỗi chung (ví dụ: đăng nhập thất bại)
    const [generalError, setGeneralError] = useState('');

    // State quản lý trạng thái loading khi submit form
    const [isLoading, setIsLoading] = useState(false);

    // ==========================================
    // Computed Values
    // Mô tả: Kiểm tra xem button có nên bị disabled không
    // Button disabled khi đang loading hoặc có trường rỗng
    // ==========================================
    const isButtonDisabled =
        isLoading ||
        !formData.email.trim() ||
        !formData.password.trim();

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

    // Kiểm tra mật khẩu có hợp lệ không
    const validatePassword = (password) => {
        if (!password.trim()) {
            return 'Mật khẩu không được để trống';
        }
        return '';
    };

    // Validate toàn bộ form trước khi submit
    const validateForm = () => {
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
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

        // Xóa thông báo lỗi chung khi user bắt đầu nhập lại
        if (generalError) {
            setGeneralError('');
        }
    };

    // Xử lý khi người dùng submit form đăng nhập
    const handleSubmit = async (e) => {
        // Ngăn chặn hành vi mặc định của form (reload trang)
        e.preventDefault();

        // Xóa thông báo lỗi chung trước khi submit
        setGeneralError('');

        // Validate form trước khi submit
        if (!validateForm()) {
            return;
        }

        // Bật trạng thái loading
        setIsLoading(true);

        try {
            // Gọi login từ AuthContext (sẽ update state và lưu token)
            const response = await loginFromContext({
                email: formData.email,
                password: formData.password,
            });

            // Lấy role từ response để redirect đúng dashboard
            const userRole = response.user?.role || response.user?.roles?.[0] || 'MEMBER';

            // Import getRedirectByRole inline để tránh circular dependency
            const { getRedirectByRole } = await import('../../constants/roles');
            const redirectPath = getRedirectByRole(userRole);

            // Đăng nhập thành công - chuyển đến dashboard theo role
            navigate(redirectPath);

        } catch (error) {
            // Hiển thị thông báo lỗi từ authService
            setGeneralError(error.message);
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
            {/* Card đăng nhập - Container form */}
            <div className="w-full max-w-md bg-bg-section rounded-2xl shadow-lg p-8 md:p-10">

                {/* ==========================================
                    Header Section
                    Mô tả: Logo và tên ứng dụng
                ========================================== */}
                <div className="flex items-center justify-center gap-3 mb-10">
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
                    Mô tả: Form đăng nhập với email và password
                ========================================== */}
                <form onSubmit={handleSubmit} className="space-y-5">

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

                    {/* Trường nhập password */}
                    <InputField
                        id="password"
                        label="Mật Khẩu"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        placeholder="Nhập mật khẩu"
                        icon={<LockIcon />}
                        error={errors.password}
                        disabled={isLoading}
                    />

                    {/* ==========================================
                        Forgot Password Link
                        Mô tả: Link quên mật khẩu
                    ========================================== */}
                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors"
                        >
                            Quên mật khẩu ?
                        </Link>
                    </div>

                    {/* ==========================================
                        General Error Message
                        Mô tả: Hiển thị thông báo lỗi chung (đăng nhập thất bại)
                    ========================================== */}
                    {generalError && (
                        <div className="text-center">
                            <p className="text-sm text-error">
                                {generalError}
                            </p>
                        </div>
                    )}

                    {/* ==========================================
                        Submit Button
                        Mô tả: Nút đăng nhập sử dụng Button component chung
                        - Disabled khi đang loading hoặc form không hợp lệ
                        - Hiển thị trạng thái loading khi đang xử lý
                    ========================================== */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        disabled={isButtonDisabled}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </form>

                {/* ==========================================
                    Register Link Section
                    Mô tả: Link chuyển đến trang đăng ký
                ========================================== */}
                <div className="text-center mt-6">
                    <span className="text-sm text-text-primary">
                        Không có tài khoản?{' '}
                    </span>
                    <Link
                        to="/register"
                        className="text-sm text-primary font-medium hover:text-primary-hover hover:underline transition-colors"
                    >
                        Đăng kí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
