// ==========================================
// Component: HeroSection
// Mô tả: Hero banner với Swiper carousel - Dynamic Popular Books
// Vị trí: src/components/ui/HeroSection.jsx
// ==========================================

import { useState, useEffect } from 'react';

// External libs
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Internal services & utils
import bookService from '@/services/book.service';
import { getBookCoverUrl } from '@/utils/imageUrl';
import { useBookDetail } from '@/contexts/BookDetailContext';
import Spinner from './Spinner';
import FloatingChatButton from './FloatingChatButton';

// ==========================================
// Component: HeroSection
// ==========================================

const HeroSection = ({
    title = 'Ngọn Hải Đăng Tri Thức',
    subtitle = 'Học từ quá khứ để xây dựng tương lai tốt đẹp hơn',
}) => {
    // ==========================================
    // Hooks & State
    // ==========================================
    const { openBookDetail } = useBookDetail();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ==========================================
    // Fetch Data
    // ==========================================
    useEffect(() => {
        const fetchPopularBooks = async () => {
            try {
                // API: GET /book?sort=popular&limit=11
                const response = await bookService.getAll({
                    sort: 'popular',
                    limit: 11
                });

                const booksData = Array.isArray(response) ? response : (response.data || response.books || []);
                setBooks(booksData);
            } catch (err) {
                console.error('Failed to fetch popular books for hero section:', err);
                setError('Không thể tải danh sách sách nổi bật.');
            } finally {
                setLoading(false);
            }
        };

        fetchPopularBooks();
    }, []);

    // ==========================================
    // Render
    // ==========================================

    // Loading State
    if (loading) {
        return (
            <section className="relative bg-bg-hero py-12 px-4 h-[400px] flex items-center justify-center overflow-hidden">
                <Spinner size="lg" className="border-white/30 border-t-white" />
            </section>
        );
    }

    // Empty/Error State
    if (!loading && (error || books.length === 0)) {
        // Fallback nhẹ nhàng nếu không có data, không hiển thị lỗi quá gắt
        return null;
    }

    return (
        <section className="relative bg-bg-hero py-12 px-4 overflow-hidden">
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary-hover/30" />

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto">
                {/* Hero Text */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white italic mb-4">
                        {title}
                    </h1>
                    <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Swiper Carousel with Pagination */}
                <div className="relative">
                    <Swiper
                        modules={[EffectCoverflow, Autoplay, Pagination]}
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        loop={books.length > 5} // Chỉ loop nếu đủ items
                        initialSlide={Math.floor(books.length / 2)}
                        speed={600}
                        slidesPerView={2} // Mobile default
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 120,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            480: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 4,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                        }}
                        className="hero-carousel"
                    >
                        {books.map((book) => {
                            const bookId = book.book_id || book.id || book._id;
                            const coverUrl = getBookCoverUrl(book.cover_url || book.coverImage || book.image || book.thumbnail);

                            return (
                                <SwiperSlide key={bookId}>
                                    {({ isActive }) => (
                                        <div
                                            className="book-slide"
                                            style={{
                                                transform: isActive ? 'scale(1.05)' : 'scale(0.85)',
                                                opacity: isActive ? 1 : 0.7,
                                                transition: 'all 0.5s ease-out',
                                            }}
                                            onClick={() => openBookDetail(bookId)}
                                        >
                                            {/* Book Cover */}
                                            <div
                                                className={`
                                                w-[140px] h-[200px] sm:w-[170px] sm:h-[250px] 
                                                rounded-lg overflow-hidden cursor-pointer
                                                transition-all duration-500
                                                ${isActive
                                                        ? 'shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-4 ring-white/60'
                                                        : 'shadow-md hover:ring-2 hover:ring-white/30'
                                                    }
                                            `}
                                            >
                                                <img
                                                    src={coverUrl}
                                                    alt={book.title || 'Sách'}
                                                    className="w-full h-full object-cover"
                                                    draggable="false"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>

            {/* Chat Button */}
            <FloatingChatButton />

            {/* Custom CSS */}
            <style>{`
                /* Carousel Container */
                .hero-carousel {
                    overflow: visible !important;
                    padding: 40px 0 60px 0;
                }
                
                .hero-carousel .swiper-wrapper {
                    align-items: center;
                }
                
                .hero-carousel .swiper-slide {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                /* Book Slide Cursor */
                .book-slide {
                    cursor: pointer;
                }
                
                /* Pagination */
                .hero-carousel .swiper-pagination {
                    bottom: 0 !important;
                }
                .hero-carousel .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.5);
                    opacity: 1;
                }
                .hero-carousel .swiper-pagination-bullet-active {
                    background: #FFF;
                    transform: scale(1.2);
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
