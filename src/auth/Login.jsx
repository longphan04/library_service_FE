// ==========================================
// Component: Login (Simplified)
// Mô tả: Trang đăng nhập đơn giản
// ==========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/icons/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { login: loginFromContext } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra cơ bản
        if (!formData.email.trim() || !formData.password.trim()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginFromContext({
                email: formData.email,
                password: formData.password,
            });

            // Lấy role và redirect
            const userRole = response.user?.role || response.user?.roles?.[0] || 'MEMBER';
            const { getRedirectByRole } = await import('../../constants/roles');
            const redirectPath = getRedirectByRole(userRole);
            navigate(redirectPath);

        } catch (error) {
            console.error('Login error:', error);
            // Có thể thêm thông báo lỗi đơn giản nếu cần
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-bg-section rounded-2xl shadow-lg p-8 md:p-10">
                
                {/* Logo và tên ứng dụng */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <img
                        src={Logo}
                        alt="Library System Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <h1 className="text-xl font-semibold text-primary">
                        Library system
                    </h1>
                </div>

                {/* Form đăng nhập đơn giản */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="Nhập email"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Nhập mật khẩu"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
                        className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;