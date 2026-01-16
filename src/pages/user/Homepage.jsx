// ==========================================
// Page: Homepage
// Mô tả: Trang chủ của hệ thống thư viện với dữ liệu từ API
// Vị trí: src/pages/user/Homepage.jsx
// ==========================================

import { useState, useEffect } from 'react';
import Header from '../../componants/layouts/Header';
import HeroSection from '../../componants/ui/HeroSection';
import BookSection from '../../componants/ui/BookSection';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/book.service';
import categoryService from '../../services/category.service';

// ==========================================
// Homepage Component
// ==========================================
const Homepage = () => {
    const { isAuthenticated } = useAuth();

    // State cho các section sách
    const [latestBooks, setLatestBooks] = useState([]);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [sciFiBooks, setSciFiBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories để lấy ID
                const categoriesRes = await categoryService.getAll();
                const categoriesData = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data || [];
                setCategories(categoriesData);

                // Fetch sách mới nhất
                const latestRes = await bookService.getAll({ limit: 6, sort: '-createdAt' });
                setLatestBooks(Array.isArray(latestRes) ? latestRes : latestRes.data || []);

                // Tìm category Khoa Học Viễn Tưởng
                const sciFiCategory = categoriesData.find(cat =>
                    cat.name?.toLowerCase().includes('khoa học viễn tưởng') ||
                    cat.name?.toLowerCase().includes('sci-fi') ||
                    cat.name?.toLowerCase().includes('science fiction')
                );

                if (sciFiCategory) {
                    const sciFiRes = await bookService.getAll({
                        category: sciFiCategory.id || sciFiCategory._id,
                        limit: 6
                    });
                    setSciFiBooks(Array.isArray(sciFiRes) ? sciFiRes : sciFiRes.data || []);
                }

                // Fetch sách đề xuất (có thể dựa trên category khác hoặc random)
                if (isAuthenticated) {
                    const recommendedRes = await bookService.getAll({ limit: 6 });
                    setRecommendedBooks(Array.isArray(recommendedRes) ? recommendedRes : recommendedRes.data || []);
                }

            } catch (error) {
                console.error('Error fetching homepage data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    // Loading skeleton
    const BookSectionSkeleton = ({ title }) => (
        <div className="bg-bg-section rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-border rounded w-1/4"></div>
                <div className="h-4 bg-border rounded w-16"></div>
            </div>
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

    // Transform book data for BookSection component
    const transformBooks = (books) => {
        return books.map(book => ({
            id: book.book_id || book.id || book._id,
            title: book.title,
            author: book.authors?.[0]?.name || book.author?.name || book.authorName || 'Không rõ',
            coverImage: book.cover_url || book.coverImage || book.image || book.thumbnail,
        }));
    };

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
                    {/* Mới nhất Section */}
                    {loading ? (
                        <BookSectionSkeleton title="Mới nhất" />
                    ) : (
                        <BookSection
                            title="Mới nhất"
                            books={transformBooks(latestBooks)}
                            viewAllLink="/books?sort=-createdAt"
                        />
                    )}

                    {/* Đề xuất Section - Chỉ hiển thị cho user đã đăng nhập */}
                    {isAuthenticated && (
                        loading ? (
                            <BookSectionSkeleton title="Đề xuất" />
                        ) : (
                            <BookSection
                                title="Đề xuất"
                                books={transformBooks(recommendedBooks)}
                                viewAllLink="/books"
                            />
                        )
                    )}

                    {/* Khoa Học Viễn Tưởng Section */}
                    {loading ? (
                        <BookSectionSkeleton title="Khoa Học Viễn Tưởng" />
                    ) : sciFiBooks.length > 0 ? (
                        <BookSection
                            title="Khoa Học Viễn Tưởng"
                            books={transformBooks(sciFiBooks)}
                            viewAllLink="/search?category=khoa-hoc-vien-tuong"
                        />
                    ) : null}
                </div>
            </main>
        </div>
    );
};

export default Homepage;
