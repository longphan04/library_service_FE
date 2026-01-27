// ==========================================
// Component: ResetPassword
// Mô tả: Trang đặt lại mật khẩu mới sau khi nhận token từ email
// Vị trí: src/pages/auth/ResetPassword.jsx
// ==========================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Index';
import InputField from '../../components/ui/InputField';
import Toast from '../../components/ui/Toast';

// Import icons từ assets
import { LockIcon } from '../../assets/icons';

// Import logo từ assets
import Logo from '../../assets/icons/logo.png';

// Import service
import { resetPassword } from '../../services/auth.service';

// ==========================================
// Constants
// ==========================================
const MIN_PASSWORD_LENGTH = 6;

// ==========================================
// ResetPassword Component
// ==========================================
const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Lấy token từ URL query parameter
    const token = searchParams.get('token');

    // ==========================================
    // State Management
    // ==========================================
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Toast state
    const [toast, setToast] = useState({
        isOpen: false,
        type: '',
        message: ''
    });

    // Kiểm tra token khi component mount
    useEffect(() => {
        if (!token) {
            setToast({
                isOpen: true,
                type: 'error',
                message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.'
            });
        }
    }, [token]);

    // ==========================================
    // Computed Values
    // ==========================================
    const isButtonDisabled = isLoading || !formData.password.trim() || !formData.confirmPassword.trim() || !token;

    // ==========================================
    // Validation Functions
    // ==========================================
    const validatePassword = (password) => {
        if (!password.trim()) {
            return 'Mật khẩu không được để trống';
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`;
        }
        return '';
    };

    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword.trim()) {
            return 'Vui lòng xác nhận mật khẩu';
        }
        if (confirmPassword !== formData.password) {
            return 'Mật khẩu xác nhận không khớp';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    // ==========================================
    // Event Handlers
    // ==========================================
    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!token) {
            setToast({
                isOpen: true,
                type: 'error',
                message: 'Token không hợp lệ. Vui lòng yêu cầu link mới.'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Gọi API /reset-password
            await resetPassword({
                token: token,
                password: formData.password,
            });

            // Thành công - hiển thị toast và redirect
            setToast({
                isOpen: true,
                type: 'success',
                message: 'Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...'
            });

            // Redirect sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setToast({
                isOpen: true,
                type: 'error',
                message: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // Render Component
    // ==========================================
    return (
        <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
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
                        Đặt lại mật khẩu
                    </h2>
                    <p className="text-sm text-text-sub">
                        Nhập mật khẩu mới cho tài khoản của bạn
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Trường nhập mật khẩu mới */}
                    <InputField
                        id="password"
                        label="Mật khẩu mới"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        placeholder="Nhập mật khẩu mới"
                        icon={<LockIcon />}
                        error={errors.password}
                        disabled={isLoading || !token}
                    />

                    {/* Trường xác nhận mật khẩu */}
                    <InputField
                        id="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        placeholder="Nhập lại mật khẩu mới"
                        icon={<LockIcon />}
                        error={errors.confirmPassword}
                        disabled={isLoading || !token}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        disabled={isButtonDisabled}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
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

export default ResetPassword;
