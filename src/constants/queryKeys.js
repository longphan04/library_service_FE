// ==========================================
// Query Keys Constants
// Mô tả: Định nghĩa keys cho API queries và caching
// Vị trí: src/constants/queryKeys.js
// ==========================================

/**
 * Query keys cho API endpoints
 * Dùng để identify và cache queries
 */
export const QUERY_KEYS = {
    // Auth & User
    USER: 'user',
    USER_ME: 'user-me',

    // Books
    BOOKS: 'books',
    BOOK_DETAIL: 'book-detail',

    // Categories
    CATEGORIES: 'categories',
    CATEGORY_DETAIL: 'category-detail',

    // Authors
    AUTHORS: 'authors',
    AUTHOR_DETAIL: 'author-detail',

    // Publishers
    PUBLISHERS: 'publishers',
    PUBLISHER_DETAIL: 'publisher-detail',

    // Book Hold
    BOOK_HOLDS: 'book-holds',
    MY_BOOK_HOLDS: 'my-book-holds',

    // Borrow Ticket
    BORROW_TICKETS: 'borrow-tickets',
    MY_BORROW_TICKETS: 'my-borrow-tickets',
    BORROW_TICKET_DETAIL: 'borrow-ticket-detail',
};

export default QUERY_KEYS;
