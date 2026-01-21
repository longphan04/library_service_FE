// ==========================================
// Category Service
// Mô tả: Service layer xử lý các API liên quan đến danh mục sách
// 
// Các endpoint được hỗ trợ:
//   - GET /category          - Lấy tất cả danh mục
//   - GET /category/:id      - Lấy chi tiết danh mục
//   - GET /category/hot      - Lấy danh mục nổi bật (hot categories)
// ==========================================

import axios from './axios';

// ==========================================
// getAll - Lấy tất cả danh mục
// ==========================================

/**
 * Lấy danh sách tất cả categories
 * Sử dụng cho: CategoryDropdown, CategoriesPage
 * 
 * @returns {Promise<Array>} Mảng các category:
 *   - id/_id: ID danh mục
 *   - name: Tên danh mục
 *   - bookCount: Số sách trong danh mục
 *   - image: URL ảnh đại diện (nếu có)
 * 
 * @example
 * const categories = await categoryService.getAll();
 * // [{ id: 'abc', name: 'Lịch sử', bookCount: 50 }, ...]
 */
export const getAll = async () => {
    const response = await axios.get('/category');
    return response.data;
};

// ==========================================
// getById - Lấy chi tiết danh mục
// ==========================================

/**
 * Lấy thông tin chi tiết category theo ID
 * Sử dụng cho: CategoryBookList
 * 
 * @param {string|number} id - ID của danh mục
 * 
 * @returns {Promise<Object>} Thông tin chi tiết danh mục:
 *   - id: ID danh mục
 *   - name: Tên danh mục
 *   - description: Mô tả
 *   - bookCount: Số sách
 *   - image: URL ảnh đại diện
 * 
 * @example
 * const category = await categoryService.getById('abc123');
 * console.log(category.name); // "Lịch sử"
 */
export const getById = async (id) => {
    const response = await axios.get(`/category/${id}`);
    return response.data;
};

// ==========================================
// getHotCategories - Lấy danh mục nổi bật
// ==========================================

/**
 * Lấy danh sách các danh mục nổi bật (hot categories)
 * API trả về 3 danh mục được đánh dấu nổi bật
 * Sử dụng cho: HotCategorySection trên Homepage
 * 
 * @returns {Promise<Array>} Mảng 3 hot categories:
 *   - id/_id: ID danh mục
 *   - name: Tên danh mục
 *   - image/cover_url: URL ảnh đại diện
 *   - bookCount: Số sách trong danh mục
 * 
 * @example
 * const hotCategories = await categoryService.getHotCategories();
 * // 3 categories với ảnh để hiển thị trên homepage
 */
export const getHotCategories = async () => {
    const response = await axios.get('/category/hot');
    return response.data;
};

// ==========================================
// getCategoryStats - Lấy thống kê tồn kho theo danh mục
// ==========================================

/**
 * Lấy thống kê tồn kho theo danh mục
 * Endpoint: GET /dashboard/category-stats
 * @returns {Promise<Array>}
 */
export const getCategoryStats = async () => {
    try {
        const response = await axios.get('/dashboard/category-stats');
        return response.data;
    } catch (error) {
        console.warn("API /dashboard/category-stats failed, using mock data", error);
        return [
            { id: 1, name: "Văn học", total: 150, available: 120, borrowed: 30 },
            { id: 2, name: "Kinh tế", total: 100, available: 80, borrowed: 20 },
            { id: 3, name: "Thiếu nhi", total: 200, available: 180, borrowed: 20 },
            { id: 4, name: "Lịch sử", total: 80, available: 75, borrowed: 5 },
            { id: 5, name: "Khoa học - Kỹ thuật", total: 120, available: 110, borrowed: 10 },
            { id: 6, name: "Ngoại ngữ", total: 90, available: 85, borrowed: 5 },
            { id: 7, name: "Tâm lý - Kỹ năng sống", total: 130, available: 100, borrowed: 30 },
            { id: 8, name: "Truyện tranh", total: 300, available: 250, borrowed: 50 },
            { id: 9, name: "Giáo trình", total: 50, available: 40, borrowed: 10 },
            { id: 10, name: "Báo - Tạp chí", total: 60, available: 55, borrowed: 5 },
            { id: 11, name: "Từ điển", total: 40, available: 38, borrowed: 2 },
            { id: 12, name: "Sách tham khảo", total: 70, available: 65, borrowed: 5 }
        ];
    }
};

// ==========================================
// Export Service Object
// ==========================================

const categoryService = {
    getAll,           // Lấy tất cả danh mục
    getById,          // Lấy chi tiết danh mục
    getHotCategories, // Lấy danh mục nổi bật
    getCategoryStats, // Lấy thống kê tồn kho
};

export default categoryService;
