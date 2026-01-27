// ==========================================
// Page: Homepage
// Mô tả: Trang chủ của hệ thống thư viện với dữ liệu từ API
// 
// Cấu trúc:
//   - Header: Navigation bar
//   - HeroSection: Banner chính với carousel sách
//   - HotCategorySection: 3 danh mục nổi bật với hình ảnh
//   - BookSection(s): Các section sách (Mới nhất, Đề xuất)
//
// Vị trí: src/pages/user/Homepage.jsx
// ==========================================

import { useState, useEffect } from 'react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import HeroSection from '../../components/ui/HeroSection';
import HotCategorySection from '../../components/ui/HotCategorySection';
import BookSection from '../../components/ui/BookSection';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/book.service';
import { getBookCoverUrl } from '../../utils/imageUrl';

// ==========================================
// Homepage Component
// ==========================================

const Homepage = () => {
    // Kiểm tra trạng thái đăng nhập
    const { isAuthenticated } = useAuth();

    // ==========================================
    // State cho các section sách
    // ==========================================

    /** Danh sách sách mới nhất */
    const [latestBooks, setLatestBooks] = useState([]);

    /** Danh sách sách đề xuất (chỉ hiển thị khi đã đăng nhập) */
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    /** Trạng thái loading */
    const [loading, setLoading] = useState(true);

    // ==========================================
    // Fetch dữ liệu khi component mount
    // ==========================================

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch sách mới nhất (18 cuốn - 3 trang slide)
                const latestRes = await bookService.getAll({
                    limit: 18,
                    sort: 'newest'
                });
                setLatestBooks(Array.isArray(latestRes) ? latestRes : latestRes.data || []);

                // Fetch sách đề xuất (chỉ khi đã đăng nhập)
                if (isAuthenticated) {
                    const recommendedRes = await bookService.getRecommendations(12);
                    setRecommendedBooks(Array.isArray(recommendedRes)
                        ? recommendedRes
                        : recommendedRes.data || []);
                }

            } catch (error) {
                console.error('Lỗi khi tải dữ liệu trang chủ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    // ==========================================
    // Transform book data cho BookSection
    // ==========================================

    /**
     * Chuẩn hóa dữ liệu sách từ API cho BookSection component
     * Xử lý các field name khác nhau giữa các API response
     */
    const transformBooks = (books) => {
        return books.map(book => ({
            id: book.book_id || book.id || book._id,
            title: book.title,
            author: book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ',
            coverImage: getBookCoverUrl(
                book.cover_url || book.coverImage || book.image || book.thumbnail
            ),
        }));
    };

    // ==========================================
    // Render
    // ==========================================

    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header / Navbar */}
            <Header />

            {/* Main Content */}
            <main>
                {/* ========================================== */}
                {/* Hero Section - Banner chính với carousel */}
                {/* ========================================== */}
                <HeroSection
                    title="Ngọn Hải Đăng Tri Thức"
                    subtitle="Học từ quá khứ để xây dựng tương lai tốt đẹp hơn"
                />

                {/* Book Sections Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* ========================================== */}
                    {/* Hot Category Section */}
                    {/* 3 danh mục nổi bật với hình ảnh và sách */}
                    {/* ========================================== */}
                    <HotCategorySection />

                    {/* ========================================== */}
                    {/* Mới nhất Section */}
                    {/* Hiển thị 6 sách mới nhất */}
                    {/* ========================================== */}
                    <BookSection
                        title="Mới nhất"
                        books={transformBooks(latestBooks)}
                        viewAllLink="/search?sort=-createdAt"
                        isLoading={loading}
                    />

                    {/* ========================================== */}
                    {/* Đề xuất Section */}
                    {/* Chỉ hiển thị cho user đã đăng nhập */}
                    {/* ========================================== */}
                    {isAuthenticated && (
                        <BookSection
                            title="Đề xuất cho bạn"
                            books={transformBooks(recommendedBooks)}
                            viewAllLink="/search"
                            isLoading={loading}
                        />
                    )}
                </div>
            </main>

            {/* Footer - Sticky at bottom */}
            <Footer />
        </div>
    );
};

export default Homepage;
