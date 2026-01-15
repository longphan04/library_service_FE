// ==========================================
// Component: HeroSection
// Mô tả: Hero banner với Swiper carousel - 11 sách, pagination dots, smooth transitions
// Vị trí: src/components/ui/HeroSection.jsx
// ==========================================

import { MessageCircle } from 'lucide-react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// ==========================================
// Default 11 placeholder books
// ==========================================
const DEFAULT_BOOKS = [
    { id: 1, src: '', alt: 'Sách 1' },
    { id: 2, src: '', alt: 'Sách 2' },
    { id: 3, src: '', alt: 'Sách 3' },
    { id: 4, src: '', alt: 'Sách 4' },
    { id: 5, src: '', alt: 'Sách 5' },
    { id: 6, src: '', alt: 'Sách 6' },
    { id: 7, src: '', alt: 'Sách 7' },
    { id: 8, src: '', alt: 'Sách 8' },
    { id: 9, src: '', alt: 'Sách 9' },
    { id: 10, src: '', alt: 'Sách 10' },
    { id: 11, src: '', alt: 'Sách 11' },
];

// ==========================================
// Props:
// - images: array - Danh sách ảnh bìa sách (max 11)
// - title: string - Tiêu đề chính
// - subtitle: string - Mô tả phụ
// ==========================================

const HeroSection = ({
    images = [],
    title = 'Ngọn Hải Đăng Tri Thức',
    subtitle = 'Học từ quá khứ để xây dựng tương lai tốt đẹp hơn',
}) => {
    // Sử dụng images nếu có, ngược lại dùng DEFAULT_BOOKS (max 11)
    const displayImages = images.length > 0
        ? images.slice(0, 11)
        : DEFAULT_BOOKS;

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
                        loop={true}
                        initialSlide={5}
                        speed={600}
                        slidesPerView={5}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: false,
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
                        {displayImages.map((image, index) => (
                            <SwiperSlide key={image.id || index}>
                                {({ isActive }) => (
                                    <div
                                        className="book-slide"
                                        style={{
                                            transform: isActive ? 'scale(1.05)' : 'scale(0.85)',
                                            opacity: isActive ? 1 : 0.7,
                                            transition: 'all 0.5s ease-out',
                                        }}
                                    >
                                        {/* Book Cover */}
                                        <div
                                            className={`
                                                w-[170px] h-[250px] rounded-lg overflow-hidden
                                                transition-all duration-500
                                                ${isActive
                                                    ? 'shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-4 ring-white/60'
                                                    : 'shadow-md'
                                                }
                                            `}
                                        >
                                            {image.src ? (
                                                <img
                                                    src={image.src}
                                                    alt={image.alt || `Book ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    draggable="false"
                                                />
                                            ) : (
                                                /* Placeholder */
                                                <div
                                                    className={`
                                                        w-full h-full flex items-center justify-center
                                                        transition-colors duration-500
                                                        ${isActive
                                                            ? 'bg-[#4a3a30]'
                                                            : 'bg-primary-hover'
                                                        }
                                                    `}
                                                >
                                                    <svg
                                                        className="w-14 h-14 text-white/40"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Chat Button */}
            <button
                type="button"
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-text-sub text-white shadow-lg hover:bg-text-primary hover:scale-110 transition-all duration-300"
                aria-label="Chat hỗ trợ"
            >
                <MessageCircle size={24} />
            </button>

            {/* ==========================================
                Custom CSS for Swiper & Pagination Dots
            ========================================== */}
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
                    cursor: grab;
                }
                .book-slide:active {
                    cursor: grabbing;
                }
                
                /* ===== PAGINATION DOTS STYLING ===== */
                .hero-carousel .swiper-pagination {
                    bottom: 0 !important;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                }
                
                /* Default dot style - Light brown/gray */
                .hero-carousel .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.35);
                    opacity: 1;
                    border-radius: 50%;
                    transition: all 0.4s ease;
                    cursor: pointer;
                }
                
                /* Hover state */
                .hero-carousel .swiper-pagination-bullet:hover {
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(1.1);
                }
                
                /* Active dot style - Dark brown (primary theme) */
                .hero-carousel .swiper-pagination-bullet-active {
                    background: #FFF;
                    transform: scale(1.3);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
