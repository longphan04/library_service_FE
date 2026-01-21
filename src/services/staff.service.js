import axios from './axios';

// ==========================================
// Staff Service - Quản lý nhân viên
// ==========================================

/**
 * Lấy danh sách nhân viên
 * @param {Object} options - Query options (search, page, limit, etc.)
 * @returns {Promise} - List of staff with pagination
 */
export const getStaff = async (options = {}) => {
    try {
        const params = new URLSearchParams();
        if (options.search) params.append('search', options.search);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.status) params.append('status', options.status);

        const url = params.toString() ? `/user/staff?${params.toString()}` : '/user/staff';
        const response = await axios.get(url);

        // Transform API response to match frontend expectations
        if (response.data.data && Array.isArray(response.data.data)) {
            const transformedStaff = response.data.data.map(staff => ({
                id: staff.user_id,
                name: staff.profile?.full_name || staff.full_name || 'N/A',
                email: staff.email,
                status: staff.status?.toLowerCase() || 'inactive',
                createdAt: staff.created_at || staff.createdAt || new Date().toISOString(),
                username: staff.username || staff.email,
                isActive: staff.status === 'ACTIVE' || staff.status === 'active',
            }));

            return {
                data: transformedStaff,
                pagination: response.data.pagination || {
                    page: 1,
                    limit: 18,
                    total: response.data.data.length,
                    totalItems: response.data.pagination?.totalItems || response.data.data.length,
                },
            };
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching staff:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Lấy chi tiết nhân viên theo ID
 */
export const getStaffById = async (staffId) => {
    try {
        const response = await axios.get(`/user/staff/${staffId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching staff by ID:', error);
        throw error;
    }
};

/**
 * Thêm nhân viên mới
 */
export const addStaff = async (staffData) => {
    try {
        const response = await axios.post('/user/register-staff', staffData);
        return response.data;
    } catch (error) {
        console.error('Error adding staff:', error);
        throw error;
    }
};

/**
 * Đăng ký tài khoản cho nhân viên mới
 * Uses the standard /auth/register endpoint with role parameter
 */
export const createStaff = async (staffData) => {
    try {
        // Prepare registration data with STAFF role
        const registrationData = {
            email: staffData.email,
            password: staffData.password,
            full_name: staffData.name,
            role: 'STAFF', // Specify role as STAFF
        };

        // Use the standard registration endpoint
        const response = await axios.post('/auth/register-staff', registrationData);
        return response.data;
    } catch (error) {
        console.error('Error creating staff:', error.response?.data || error.message);

        // Provide more helpful error messages
        if (error.response?.status === 400) {
            throw new Error(error.response.data?.message || 'Dữ liệu không hợp lệ');
        } else if (error.response?.status === 409) {
            throw new Error('Email đã tồn tại trong hệ thống');
        } else if (error.response?.status === 500) {
            throw new Error('Lỗi server. Vui lòng thử lại sau');
        }

        throw error;
    }
};

/**
 * Cập nhật thông tin nhân viên
 */
export const updateStaff = async (staffId, staffData) => {
    try {
        const response = await axios.put(`/user/staff/${staffId}`, staffData);
        return response.data;
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    }
};

/**
 * Cập nhật trạng thái nhân viên (khoá/mở khoá)
 */
export const updateStaffStatus = async (staffId, status) => {
    try {
        if (!['active', 'banned'].includes(status)) {
            throw new Error('Invalid status. Must be "active" or "banned"');
        }

        const apiStatus = status === 'banned' ? 'BANNED' : 'ACTIVE';

        // Try multiple endpoint patterns
        const patterns = [
            { method: 'put', url: `/user/staff/${staffId}/status`, data: { status: apiStatus } },
            { method: 'put', url: `/user/staff/${staffId}`, data: { status: apiStatus } },
            { method: 'patch', url: `/user/${staffId}`, data: { status: apiStatus } },
            { method: 'patch', url: `/admin/staff/${staffId}`, data: { status: apiStatus } },
        ];

        let lastError = null;

        for (const pattern of patterns) {
            try {
                let response;
                if (pattern.method === 'put') {
                    response = await axios.put(pattern.url, pattern.data);
                } else {
                    response = await axios.patch(pattern.url, pattern.data);
                }
                return response.data;
            } catch (error) {
                lastError = error;
                // Continue to next pattern if 404
                if (error.response?.status !== 404) {
                    throw error;
                }
            }
        }

        // If all patterns fail, throw last error
        throw lastError;
    } catch (error) {
        console.error('Error updating staff status:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Xóa nhân viên
 */
export const deleteStaff = async (staffId) => {
    try {
        // Try multiple endpoint patterns
        const patterns = [
            `/user/${staffId}`,
            `/user/staff/${staffId}`,
            `/admin/staff/${staffId}`,
            `/staff/${staffId}`,
        ];

        let lastError = null;

        for (const url of patterns) {
            try {
                const response = await axios.delete(url);
                return response.data;
            } catch (error) {
                lastError = error;
                // Continue to next pattern if 404
                if (error.response?.status !== 404) {
                    throw error;
                }
            }
        }

        // If all patterns fail, throw last error
        throw lastError;
    } catch (error) {
        console.error('Error deleting staff:', error);
        throw error;
    }
};

/**
 * Khoá nhân viên
 */
export const lockStaff = async (staffId) => {
    try {
        const response = await axios.put(`/user/staff/${staffId}/lock`);
        return response.data;
    } catch (error) {
        console.error('Error locking staff:', error);
        throw error;
    }
};

/**
 * Mở khoá nhân viên
 */
export const unlockStaff = async (staffId) => {
    try {
        const response = await axios.put(`/user/staff/${staffId}/unlock`);
        return response.data;
    } catch (error) {
        console.error('Error unlocking staff:', error);
        throw error;
    }
};

/**
 * Thay đổi mật khẩu nhân viên
 */
export const changePassword = async (staffId, passwordData) => {
    try {
        const response = await axios.put(`/user/staff/${staffId}/change-password`, passwordData);
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

const staffService = {
    getStaff,
    getStaffById,
    addStaff,
    createStaff,
    updateStaff,
    updateStaffStatus,
    deleteStaff,
    lockStaff,
    unlockStaff,
    changePassword,
};

export default staffService;
