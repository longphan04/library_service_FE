// ==========================================
// Icons Export
// Mô tả: Xuất tất cả các icon SVG dùng trong ứng dụng
// Vị trí: src/assets/icons/index.js
// ==========================================

// ==========================================
// Icon: UserIcon
// Mô tả: Icon người dùng cho input tên
// ==========================================
export const UserIcon = ({ className = '' }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`text-text-sub ${className}`}
    >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
);

// ==========================================
// Icon: EmailIcon
// Mô tả: Icon email cho input email
// ==========================================
export const EmailIcon = ({ className = '' }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`text-text-sub ${className}`}
    >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 6L12 13L2 6" />
    </svg>
);

// ==========================================
// Icon: LockIcon
// Mô tả: Icon khóa cho input mật khẩu
// ==========================================
export const LockIcon = ({ className = '' }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`text-text-sub ${className}`}
    >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
