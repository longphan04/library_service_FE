// ==========================================
// Toast Notification Utility
// Mô tả: Provides simple toast notification functions
// ==========================================

/**
 * Simple toast notification using browser's alert
 * For better UX, consider integrating toast library like react-toastify or sonner
 */
export const toast = {
    /**
     * Show success message
     * @param {string} message - Success message
     */
    success: (message) => {
        console.log("✓ Success:", message);
        // Could integrate with react-toastify: toast.success(message)
    },

    /**
     * Show error message
     * @param {string} message - Error message
     */
    error: (message) => {
        console.error("✗ Error:", message);
        // Could integrate with react-toastify: toast.error(message)
    },

    /**
     * Show info message
     * @param {string} message - Info message
     */
    info: (message) => {
        console.info("ℹ Info:", message);
        // Could integrate with react-toastify: toast.info(message)
    },

    /**
     * Show warning message
     * @param {string} message - Warning message
     */
    warning: (message) => {
        console.warn("⚠ Warning:", message);
        // Could integrate with react-toastify: toast.warning(message)
    },
};

export default toast;
