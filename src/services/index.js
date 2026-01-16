// ==========================================
// Services Index
// Mô tả: Export tất cả services để dễ import
// ==========================================

export { default as authService } from './auth.service';
export { default as userService } from './user.service';
export { default as categoryService } from './category.service';
export { default as bookService } from './book.service';
export { default as authorService } from './author.service';
export { default as publisherService } from './publisher.service';
export { default as bookHoldService } from './book-hold.service';
export * as borrowTicketService from './borrow-ticket.service';

// Re-export axios instance
export { default as axios } from './axios';
