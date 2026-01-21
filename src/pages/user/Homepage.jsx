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
import BookDetailModal from '../../components/ui/BookDetailModal';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/book.service';

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

    // State cho Book Detail Modal
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
                    sort: '-createdAt'
                });
                setLatestBooks(Array.isArray(latestRes) ? latestRes : latestRes.data || []);

                // Fetch sách đề xuất (chỉ khi đã đăng nhập)
                if (isAuthenticated) {
                    const recommendedRes = await bookService.getAll({ limit: 18 });
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
    // Handlers
    // ==========================================

    const handleBookClick = (bookId) => {
        setSelectedBookId(bookId);
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        // Reset selected book after animation (optional) or immediately
        // setSelectedBookId(null); 
    };

    // ==========================================
    // Loading Skeleton Component
    // ==========================================

    const BookSectionSkeleton = ({ title }) => (
        <div className="bg-bg-section rounded-2xl p-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-border rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-border rounded w-16 animate-pulse"></div>
            </div>
            {/* Grid skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-3/4 bg-border rounded-lg mb-2"></div>
                        <div className="h-4 bg-border rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-border rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    );

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
            coverImage: book.cover_url || book.coverImage || book.image || book.thumbnail,
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
                    {/* ========================================== */}
                    {/* Mới nhất Section */}
                    {/* Hiển thị 6 sách mới nhất */}
                    {/* ========================================== */}
                    <BookSection
                        title="Mới nhất"
                        books={transformBooks(latestBooks)}
                        viewAllLink="/search?sort=-createdAt"
                        onBookClick={handleBookClick}
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
                            onBookClick={handleBookClick}
                            isLoading={loading}
                        />
                    )}
                </div>
            </main>

            {/* Book Detail Modal */}
            <BookDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                bookId={selectedBookId}
            />

            {/* Footer - Sticky at bottom */}
            <Footer />
        </div>
    );
};

export default Homepage;
