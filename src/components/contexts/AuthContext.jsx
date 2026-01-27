import { createContext, useContext, useState, useEffect } from 'react';
import { FALLBACK_IMAGES } from '../../utils/imageUrl';

const AuthContext = createContext(null);

// ==========================================
// MOCK USERS DATA
// ==========================================
const MOCK_USERS = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Quản trị viên',
        email: 'admin@library.com',
        role: 'ADMIN',
        avatarUrl: FALLBACK_IMAGES.avatar,
    },
    {
        id: '2',
        username: 'librarian',
        password: 'lib123',
        name: 'Thủ thư A',
        email: 'librarian@library.com',
        role: 'STAFF',
        avatarUrl: FALLBACK_IMAGES.avatar,
    },
    {
        id: '3',
        username: 'member1',
        password: '1',
        name: 'Thành viên B',
        email: 'member@library.com',
        role: 'MEMBER',
        avatarUrl: FALLBACK_IMAGES.avatar,
    },
];

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ==========================================
    // AUTO LOGOUT ON RELOAD (TUỲ CHỌN)
    // Bỏ comment dòng này nếu muốn auto logout khi reload
    // ==========================================
    useEffect(() => {
        // Xóa localStorage khi reload (tuỳ chọn)
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');

        // Hoặc giữ nguyên để remember login
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, []);

    // Login function
    const login = async (credentials) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundUser = MOCK_USERS.find(
            user => user.username === credentials.username &&
                user.password === credentials.password
        );

        if (!foundUser) {
            throw new Error('Tên tài khoản hoặc mật khẩu không đúng');
        }

        const response = {
            token: `mock-jwt-token-${foundUser.id}-${Date.now()}`,
            user: {
                id: foundUser.id,
                username: foundUser.username,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                avatarUrl: foundUser.avatarUrl,
            }
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setUser(response.user);
        setIsAuthenticated(true);

        return response;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Clear all auth data (dùng để reset)
    const clearAuth = () => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        clearAuth, // Thêm hàm clear
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-app flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải ứng dụng...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;