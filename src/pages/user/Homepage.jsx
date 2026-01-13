// ==========================================
// Page: Homepage
// Mô tả: Trang chủ của hệ thống thư viện
// Vị trí: src/pages/user/Homepage.jsx
// ==========================================

import Header from '../../componants/layouts/Header';
import HeroSection from '../../componants/ui/HeroSection';
import BookSection from '../../componants/ui/BookSection';

// ==========================================
// Mock Data - Dữ liệu mẫu (sẽ thay bằng API sau)
// ==========================================

// Ảnh bìa sách mẫu (placeholder)
const SAMPLE_COVER = 'https://via.placeholder.com/200x280/FFF8F0/7D5B4F?text=Lịch+Sử+Việt+Nam';

// Danh sách sách mẫu cho Hot list
const hotListBooks = Array.from({ length: 6 }, (_, i) => ({
    id: `hot-${i + 1}`,
    title: 'Lịch sử Việt Nam',
    author: 'Đào Duy Anh',
    coverImage: SAMPLE_COVER,
}));

// Danh sách sách mẫu cho Trinh Thám
const detectiveBooks = Array.from({ length: 6 }, (_, i) => ({
    id: `detective-${i + 1}`,
    title: 'Lịch sử Việt Nam',
    author: 'Đào Duy Anh',
    coverImage: SAMPLE_COVER,
}));

// Danh sách sách mẫu cho Khoa Học Viễn Tưởng
const sciFiBooks = Array.from({ length: 6 }, (_, i) => ({
    id: `scifi-${i + 1}`,
    title: 'Lịch sử Việt Nam',
    author: 'Đào Duy Anh',
    coverImage: SAMPLE_COVER,
}));

// ==========================================
// Homepage Component
// ==========================================
const Homepage = () => {
    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header / Navbar */}
            <Header />

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <HeroSection
                    title="Ngọn Hải Đăng Tri Thức"
                    subtitle="Học từ quá khứ để xây dựng tương lai tốt đẹp hơn"
                />

                {/* Book Sections Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Hot List Section */}
                    <BookSection
                        title="Mới nhất"
                        books={hotListBooks}
                        viewAllLink="/categories/hot"
                    />

                    {/* Trinh Thám Section */}
                    <BookSection
                        title="Đề xuất"
                        books={detectiveBooks}
                        viewAllLink="/categories/detective"
                    />

                    {/* Khoa Học Viễn Tưởng Section */}
                    <BookSection
                        title="Khoa Học Viễn Tưởng"
                        books={sciFiBooks}
                        viewAllLink="/categories/sci-fi"
                    />
                </div>
            </main>
        </div>
    );
};

export default Homepage;
