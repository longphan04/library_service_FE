// ==========================================
// Component: ForgotPassword
// Mô tả: Trang quên mật khẩu - Nhập email để lấy lại mật khẩu
// Vị trí: src/pages/auth/ForgotPassword.jsx
// ==========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Index';
import InputField from '../../components/ui/InputField';
import Toast from '../../components/ui/Toast';

// Import icons từ assets
import { EmailIcon } from '../../assets/icons';

// Import logo từ assets
import Logo from '../../assets/icons/logo.png';

// Import service
import { forgotPassword } from '../../services/auth.service';

// ==========================================
// Constants
// ==========================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// ForgotPassword Component
// ==========================================
const ForgotPassword = () => {
    // ==========================================
    // State Management
    // ==========================================
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Toast state
    const [toast, setToast] = useState({
        isOpen: false,
        type: '',
        message: ''
    });

    // ==========================================
    // Computed Values
    // ==========================================
    const isButtonDisabled = isLoading || !email.trim();

    // ==========================================
    // Validation Functions
    // ==========================================
    const validateEmail = (value) => {
        if (!value.trim()) {
            return 'Email không được để trống';
        }
        if (!EMAIL_REGEX.test(value)) {
            return 'Email không đúng định dạng';
        }
        return '';
    };

    // ==========================================
    // Event Handlers
    // ==========================================

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Xóa lỗi khi user bắt đầu sửa
        if (emailError) {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email trước khi submit
        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            return;
        }

        setIsLoading(true);

        try {
            // Gọi API /forgot-password
            await forgotPassword({ email: email.trim() });

            // Thành công - hiển thị toast success
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn!'
            });

            // Reset form sau khi thành công
            setEmail('');

        } catch (error) {
            // Lỗi - hiển thị toast error
            setToast({
                isOpen: true,
                type: 'error',
                message: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // Render Component
    // ==========================================
    return (
        // Container chính - background toàn màn hình (giống Login)
        <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
            {/* Card - Container form (giống Login) */}
            <div className="w-full max-w-md bg-bg-section rounded-2xl shadow-lg p-8 md:p-10">

                {/* Header Section - Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <img
                        src={Logo}
                        alt="Library System Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <h1 className="text-xl font-semibold text-primary">
                        Library system
                    </h1>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Quên mật khẩu
                    </h2>
                    <p className="text-sm text-text-sub">
                        Nhập email đã đăng ký để nhận liên kết khôi phục mật khẩu
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Trường nhập email */}
                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Nhập email đã đăng ký"
                        icon={<EmailIcon />}
                        error={emailError}
                        disabled={isLoading}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        disabled={isButtonDisabled}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Lấy lại mật khẩu'}
                    </Button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="text-sm text-primary font-medium hover:text-primary-hover hover:underline transition-colors"
                    >
                        ← Quay lại đăng nhập
                    </Link>
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                isOpen={toast.isOpen}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
                duration={5000}
            />
        </div>
    );
};

export default ForgotPassword;
