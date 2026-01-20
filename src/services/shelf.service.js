// ==========================================
// Shelf Service
// API quản lý kệ sách (/shelves)
// ==========================================

import axios from './axios';

// ==========================================
// GET /shelves - Lấy tất cả kệ sách
// ==========================================
export const getShelves = async () => {
    console.log('[ShelfService] GET /shelves');

    try {
        const response = await axios.get('/shelves');
        console.log('[ShelfService] ✅ Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[ShelfService] ❌ Error:', error.response?.status, error.message);
        throw error;
    }
};

// ==========================================
// GET /shelves/:id - Lấy chi tiết kệ sách
// ==========================================
export const getShelfById = async (id) => {
    if (!id) throw new Error('Shelf ID is required');

    console.log(`[ShelfService] GET /shelves/${id}`);

    try {
        const response = await axios.get(`/shelves/${id}`);
        console.log('[ShelfService] ✅ Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[ShelfService] ❌ Error:', error.response?.status, error.message);
        throw error;
    }
};

// ==========================================
// POST /shelves - Tạo kệ sách mới
// ==========================================
export const createShelf = async (data) => {
    if (!data) throw new Error('Shelf data is required');

    console.log('[ShelfService] POST /shelves', data);

    try {
        const response = await axios.post('/shelves', data);
        console.log('[ShelfService] ✅ Created:', response.data);
        return response.data;
    } catch (error) {
        console.error('[ShelfService] ❌ Error:', error.response?.status, error.response?.data);
        throw error;
    }
};

// ==========================================
// PUT /shelves/:id - Cập nhật kệ sách
// ==========================================
export const updateShelf = async (id, data) => {
    if (!id) throw new Error('Shelf ID is required');
    if (!data) throw new Error('Shelf data is required');

    console.log(`[ShelfService] PUT /shelves/${id}`, data);

    try {
        const response = await axios.put(`/shelves/${id}`, data);
        console.log('[ShelfService] ✅ Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('[ShelfService] ❌ Error:', error.response?.status, error.response?.data);
        throw error;
    }
};

// ==========================================
// DELETE /shelves/:id - Xóa kệ sách
// ==========================================
export const deleteShelf = async (id) => {
    if (!id) throw new Error('Shelf ID is required');

    console.log(`[ShelfService] DELETE /shelves/${id}`);

    try {
        const response = await axios.delete(`/shelves/${id}`);
        console.log('[ShelfService] ✅ Deleted');
        return response.data;
    } catch (error) {
        console.error('[ShelfService] ❌ Error:', error.response?.status, error.response?.data);
        throw error;
    }
};

// ==========================================
// Export default
// ==========================================
const shelfService = {
    getShelves,
    getShelfById,
    createShelf,
    updateShelf,
    deleteShelf,
};

export default shelfService;
