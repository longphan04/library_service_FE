// ==========================================
// Role Constants
// Mô tả: Định nghĩa các role trong hệ thống và redirect paths
// Vị trí: src/constants/roles.js
// ==========================================

/**
 * User roles trong hệ thống Library Management
 */
export const ROLES = {
    GUEST: 'GUEST',
    MEMBER: 'MEMBER',
    STAFF: 'STAFF',
    ADMIN: 'ADMIN',
};

/**
 * Dashboard routes theo role
 */
export const ROLE_DASHBOARDS = {
    [ROLES.MEMBER]: '/user',   // Member → User dashboard
    [ROLES.STAFF]: '/staff',   // Staff → Staff dashboard
    [ROLES.ADMIN]: '/admin',   // Admin → Admin dashboard
};

/**
 * Lấy redirect path theo role
 * @param {string} role - User role
 * @returns {string} - Redirect path
 */
export const getRedirectByRole = (role) => {
    return ROLE_DASHBOARDS[role] || '/';
};

/**
 * Kiểm tra xem role có hợp lệ không
 * @param {string} role - Role cần kiểm tra
 * @returns {boolean}
 */
export const isValidRole = (role) => {
    return Object.values(ROLES).includes(role);
};

/**
 * Kiểm tra xem user có role được phép không
 * @param {string} userRole - Role của user
 * @param {string[]} allowedRoles - Danh sách roles được phép
 * @returns {boolean}
 */
export const hasRole = (userRole, allowedRoles) => {
    return allowedRoles.includes(userRole);
};

export default ROLES;
