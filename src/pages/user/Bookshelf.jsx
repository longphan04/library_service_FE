// ==========================================
// Page: Bookshelf
// Mô tả: Trang kệ sách - hiển thị các sách đã mượn
// Vị trí: src/pages/user/Bookshelf.jsx
// ==========================================

import { useNavigate } from 'react-router-dom';
import { BookMarked, Plus, Trash2 } from 'lucide-react';
import Header from '../../componants/layouts/Header';
import BookCard from '../../componants/ui/BookCard';
import Button from '../../componants/ui/Button';
import useBorrowedBooks from '../../hooks/useBorrowedBooks';

// ==========================================
// Bookshelf Component
// ==========================================
const Bookshelf = () => {
    const navigate = useNavigate();
    const { borrowedBooks, removeBorrowedBook, clearAllBooks } = useBorrowedBooks();

    return (
        <div className="min-h-screen bg-bg-app">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="bg-bg-section rounded-2xl p-6 sm:p-8 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Left: Title */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookMarked className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">
                                    Kệ sách
                                </h1>
                                <p className="text-sm text-text-sub">
                                    {borrowedBooks.length} cuốn sách
                                </p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            {/* Add Book Button */}
                            <Button
                                variant="primary"
                                onClick={() => navigate('/categories')}
                                leftIcon={<Plus size={18} />}
                            >
                                MƯỢN SÁCH
                            </Button>

                            {/* Delete All Button */}
                            {borrowedBooks.length > 0 && (
                                <button
                                    onClick={clearAllBooks}
                                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                    aria-label="Xóa tất cả"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {borrowedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                        {borrowedBooks.map((book) => (
                            <div key={book.id} className="relative group">
                                <BookCard
                                    id={book.id}
                                    title={book.title}
                                    author={book.author}
                                    coverImage={book.coverImage}
                                />

                                {/* Version Badge */}
                                <div className="mt-2 text-center">
                                    <span className="text-xs text-text-sub">
                                        Bản lưu: {book.version}
                                    </span>
                                </div>

                                {/* Delete Button Overlay */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (window.confirm('Xóa sách này khỏi kệ sách?')) {
                                            removeBorrowedBook(book.id);
                                        }
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    aria-label="Xóa sách"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-bg-section rounded-2xl p-12 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            {/* Icon */}
                            <div className="inline-flex p-4 bg-primary/10 rounded-full">
                                <BookMarked className="w-12 h-12 text-primary" />
                            </div>

                            {/* Message */}
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">
                                    Kệ sách trống
                                </h3>
                                <p className="text-sm text-text-sub mb-6">
                                    Bạn chưa mượn cuốn sách nào. Hãy khám phá và mượn những cuốn sách yêu thích!
                                </p>
                            </div>

                            {/* CTA Button */}
                            <Button
                                variant="primary"
                                onClick={() => navigate('/categories')}
                                leftIcon={<Plus size={18} />}
                            >
                                KHÁM PHÁ SÁCH
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Bookshelf;
