// ==========================================
// Component: AdminDashboard
// Mô tả: Placeholder dashboard cho Admin role
// Vị trí: src/pages/admin/AdminDashboard.jsx
// ==========================================

/**
 * AdminDashboard Component
 * 
 * Trang dashboard dành cho quản trị viên (ADMIN role).
 * Hiện tại là placeholder, sẽ được mở rộng sau khi merge với API CRUD.
 */
const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <header className="bg-bg-section border-b border-border-primary px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-text-primary">
                        Admin Dashboard
                    </h1>
                    <p className="text-text-sub mt-1">
                        Quản trị hệ thống thư viện
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-bg-section rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">⚙️</div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                        Đang phát triển
                    </h2>
                    <p className="text-text-sub max-w-md mx-auto">
                        Trang quản trị hệ thống đang được phát triển.
                        Các chức năng quản lý người dùng, phân quyền, báo cáo sẽ sớm được cập nhật.
                    </p>
                </div>

                {/* Placeholder Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-bg-section rounded-xl p-6 border border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-2">
                            👤 Quản lý người dùng
                        </h3>
                        <p className="text-text-sub text-sm">
                            Thêm, sửa, xóa tài khoản
                        </p>
                    </div>
                    <div className="bg-bg-section rounded-xl p-6 border border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-2">
                            🔐 Phân quyền
                        </h3>
                        <p className="text-text-sub text-sm">
                            Quản lý roles và permissions
                        </p>
                    </div>
                    <div className="bg-bg-section rounded-xl p-6 border border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-2">
                            📊 Báo cáo thống kê
                        </h3>
                        <p className="text-text-sub text-sm">
                            Dashboard và analytics
                        </p>
                    </div>
                    <div className="bg-bg-section rounded-xl p-6 border border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-2">
                            🔧 Cài đặt hệ thống
                        </h3>
                        <p className="text-text-sub text-sm">
                            Cấu hình và tùy chỉnh
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
