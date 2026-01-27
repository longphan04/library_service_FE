// ==========================================
// Image URL Helper
// Xử lý URL ảnh từ API (relative path → full URL)
// ==========================================

// ==========================================
// Fallback Images (No hardcoded placeholders in components)
// ==========================================
export const FALLBACK_IMAGES = {
    book: '/assets/fallback/book.png',
    category: '/assets/fallback/category.png',
    avatar: '/assets/fallback/avatar.png',
    // Backward compatibility aliases
    bookPlaceholder: '/assets/fallback/book.png',
    categoryPlaceholder: '/assets/fallback/category.png',
    avatarPlaceholder: '/assets/fallback/avatar.png',
};

/**
 * Xây dựng URL đầy đủ cho ảnh từ API
 * 
 * API trả về relative path (ví dụ: "avatar/image.jpg")
 * FE cần prefix với base URL + /public/
 * Kết quả: https://place-potentially-downloaded-lyrics.trycloudflare.com/public/avatar/image.jpg
 * 
 * @param {string} imagePath - Path ảnh từ API (có thể là full URL hoặc relative)
 * @returns {string|null} - Full URL hoặc null nếu không có path
 * 
 * @example
 * // API trả về: avatar_url: "avatar/user123.jpg"
 * buildImageUrl('avatar/user123.jpg')
 * // → 'https://place-potentially-downloaded-lyrics.trycloudflare.com/public/avatar/user123.jpg'
 * 
 * // Full URL → return nguyên
 * buildImageUrl('https://example.com/img.jpg') 
 * // → 'https://example.com/img.jpg'
 */
export const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Nếu đã là full URL (http:// hoặc https://) → return nguyên
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Nếu là relative path → prefix với API base URL + /public/
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://place-potentially-downloaded-lyrics.trycloudflare.com';

    // Đảm bảo path không bắt đầu bằng / (tránh double slash)
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    return `${baseUrl}/public/${cleanPath}`;
};

/**
 * Build URL cho ảnh bìa sách
 * Cố định path: /public/book/
 * @param {string} coverUrl - cover_url từ API (filename hoặc relative path)
 * @returns {string} - Full URL hoặc fallback
 */
export const getBookCoverUrl = (coverUrl) => {
    if (!coverUrl) return FALLBACK_IMAGES.bookPlaceholder;

    // Nếu là full URL thì giữ nguyên
    if (coverUrl.startsWith('http')) return coverUrl;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://place-potentially-downloaded-lyrics.trycloudflare.com';

    // Clean path: xóa dấu / ở đầu nếu có
    let cleanPath = coverUrl.startsWith('/') ? coverUrl.slice(1) : coverUrl;

    // Nếu path chưa có 'book/', thêm vào
    if (!cleanPath.startsWith('book/')) {
        cleanPath = `book/${cleanPath}`;
    }

    return `${baseUrl}/public/${cleanPath}`;
};

/**
 * Build URL cho ảnh category
 * @param {string} imageUrl - image từ API
 * @returns {string} - Full URL hoặc fallback
 */
export const getCategoryImageUrl = (imageUrl) => {
    const url = buildImageUrl(imageUrl);
    return url || FALLBACK_IMAGES.categoryPlaceholder;
};

/**
 * Build URL cho avatar người dùng
 * @param {string} avatarUrl - avatar_url từ API
 * @returns {string} - Full URL hoặc fallback
 */
export const getAvatarUrl = (avatarUrl) => {
    const url = buildImageUrl(avatarUrl);
    return url || FALLBACK_IMAGES.avatarPlaceholder;
};

/**
 * Build URL cho static assets
 * @param {string} path - Đường dẫn file
 * @returns {string|null}
 */
export const buildStaticUrl = (path) => {
    if (!path) return null;

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://place-potentially-downloaded-lyrics.trycloudflare.com';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}/public/${cleanPath}`;
};

export default {
    buildImageUrl,
    buildStaticUrl,
    getBookCoverUrl,
    getCategoryImageUrl,
    getAvatarUrl,
    FALLBACK_IMAGES,
};
