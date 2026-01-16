// ==========================================
// Component: StaffDashboard
// Mô tả: Placeholder dashboard cho Staff role
// Vị trí: src/pages/staff/StaffDashboard.jsx
// ==========================================

/**
 * StaffDashboard Component
 * 
 * Trang dashboard dành cho nhân viên thư viện (STAFF role).
 * Hiện tại là placeholder, sẽ được mở rộng sau khi merge với API CRUD.
 */
const StaffDashboard = () => {
    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <header className="bg-bg-section border-b border-border-primary px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-text-primary">
                        Staff Dashboard
                    </h1>
                    <p className="text-text-sub mt-1">
                        Quản lý thư viện - Nhân viên
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-bg-section rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">🏗️</div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                        Đang phát triển
                    </h2>
                    <p className="text-text-sub max-w-md mx-auto">
                        Trang quản lý dành cho nhân viên thư viện đang được phát triển.
                        Các chức năng CRUD sách, quản lý mượn trả sẽ sớm được cập nhật.
                    </p>
                </div>

                {/* Placeholder Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-bg-section rounded-xl p-6 border border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-2">
                            📚 Quản lý sách
                        </h3>
                        <p className="text-text-sub text-sm">
                            Thêm, sửa, xóa thông tin sách
                        </p>
                    </div>
                    <div className="bg-bg-section rounded-xl p-6 border border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-2">
                            📋 Quản lý mượn trả
                        </h3>
                        <p className="text-text-sub text-sm">
                            Xử lý phiếu mượn và trả sách
                        </p>
                    </div>
                    <div className="bg-bg-section rounded-xl p-6 border border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-2">
                            👥 Quản lý thành viên
                        </h3>
                        <p className="text-text-sub text-sm">
                            Xem thông tin độc giả
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;
