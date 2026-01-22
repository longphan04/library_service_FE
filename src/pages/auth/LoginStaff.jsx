// ==========================================
// Component: LoginStaff
// Mô tả: Trang đăng nhập cho Admin và Staff
// Vị trí: src/pages/auth/LoginStaff.jsx
// ==========================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Index';
import InputField from '../../components/ui/InputField';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../constants/roles';

// Import icons từ assets
import { EmailIcon, LockIcon } from '../../assets/icons';

// Import logo từ assets
import Logo from '../../assets/icons/logo.png';

// ==========================================
// Constants
// ==========================================

// Regex validation email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Allowed roles cho trang login quản trị
const ALLOWED_ROLES = [ROLES.ADMIN, ROLES.STAFF];

// Routes - tập trung quản lý đường dẫn, tránh hard-code
const ROUTES = {
    ADMIN_DASHBOARD: '/admin',
    STAFF_DASHBOARD: '/staff',
    FORGOT_PASSWORD: '/forgot-password',
};

// ==========================================
// Helper Functions
// ==========================================

/**
 * Lấy role từ response API một cách an toàn
 * Xử lý nhiều cấu trúc response khác nhau từ API
 * @param {Object} response - Response từ login API
 * @returns {string} - User role hoặc null nếu không tìm thấy
 */
const extractUserRole = (response) => {
    // Kiểm tra response tồn tại
    if (!response || typeof response !== 'object') {
        return null;
    }

    // Lấy user object từ response (có thể nằm ở nhiều vị trí khác nhau)
    const user = response.user || response.data?.user || response;

    // Kiểm tra user tồn tại
    if (!user || typeof user !== 'object') {
        return null;
    }

    // Lấy role từ các field có thể có
    const role = user.role || user.Role || user.roles?.[0] || user.Roles?.[0] || null;

    // Validate role là string
    if (typeof role !== 'string') {
        return null;
    }

    // Chuẩn hóa role về uppercase
    return role.toUpperCase();
};

/**
 * Kiểm tra role có được phép truy cập không
 * @param {string} role - Role cần kiểm tra
 * @returns {boolean}
 */
const isRoleAllowed = (role) => {
    if (!role) return false;
    return ALLOWED_ROLES.includes(role);
};

/**
 * Lấy đường dẫn redirect dựa trên role
 * @param {string} role - User role
 * @returns {string|null} - Đường dẫn redirect hoặc null nếu role không hợp lệ
 */
const getRedirectPathByRole = (role) => {
    const routeMap = {
        [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
        [ROLES.STAFF]: ROUTES.STAFF_DASHBOARD,
    };

    return routeMap[role] || null;
};

// ==========================================
// LoginStaff Component
// ==========================================
const LoginStaff = () => {
    // Router navigate
    const navigate = useNavigate();

    // Auth context
    const { loginStaff: loginFromContext, logout: logoutFromContext } = useAuth();

    // ==========================================
    // State Management
    // ==========================================
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ==========================================
    // Computed Values
    // ==========================================
    const isButtonDisabled =
        isLoading ||
        !formData.email.trim() ||
        !formData.password.trim();

    // ==========================================
    // Validation Functions
    // ==========================================

    const validateEmail = (email) => {
        if (!email.trim()) {
            return 'Email không được để trống';
        }
        if (!EMAIL_REGEX.test(email)) {
            return 'Email không đúng định dạng';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (!password.trim()) {
            return 'Mật khẩu không được để trống';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    // ==========================================
    // Navigation Helper
    // ==========================================

    /**
     * Xử lý điều hướng sau khi login thành công
     * @param {string} role - User role
     * @returns {boolean} - true nếu redirect thành công, false nếu role không hợp lệ
     */
    const handleRedirectByRole = (role) => {
        const redirectPath = getRedirectPathByRole(role);

        if (!redirectPath) {
            return false;
        }

        navigate(redirectPath);
        return true;
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

        if (generalError) {
            setGeneralError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Gọi login từ AuthContext
            const response = await loginFromContext({
                email: formData.email,
                password: formData.password,
            });

            // Lấy role một cách an toàn từ response
            const userRole = extractUserRole(response);

            // Kiểm tra role có được phép không
            if (!isRoleAllowed(userRole)) {
                // QUAN TRỌNG: Logout ngay lập tức nếu role không hợp lệ
                // Điều này đảm bảo token không được lưu lại cho tài khoản không có quyền
                await logoutFromContext();
                setGeneralError('Tài khoản không có quyền truy cập trang quản trị');
                return;
            }

            // Role hợp lệ - redirect theo role
            const redirectSuccess = handleRedirectByRole(userRole);

            // Fallback nếu không thể redirect (không nên xảy ra nếu isRoleAllowed đã check)
            if (!redirectSuccess) {
                await logoutFromContext();
                setGeneralError('Không thể xác định trang điều hướng. Vui lòng thử lại.');
            }

        } catch (error) {
            // Hiển thị lỗi từ API hoặc AuthContext
            const errorMessage = error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setGeneralError(errorMessage);
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

                {/* Header Section - Logo và Title */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <img
                        src={Logo}
                        alt="Library System Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <h1 className="text-xl font-semibold text-primary">
                        Quản trị viên
                    </h1>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email Input */}
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

                    {/* Password Input */}
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

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <Link
                            to={ROUTES.FORGOT_PASSWORD}
                            className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors"
                        >
                            Quên mật khẩu ?
                        </Link>
                    </div>

                    {/* General Error Message */}
                    {generalError && (
                        <div className="text-center">
                            <p className="text-sm text-error">
                                {generalError}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
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

                {/* Không có link đăng ký - chỉ dành cho Admin/Staff */}
            </div>
        </div>
    );
};

export default LoginStaff;