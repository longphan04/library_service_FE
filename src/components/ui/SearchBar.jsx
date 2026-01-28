// ==========================================
// Component: SearchBar
// Mô tả: Thanh tìm kiếm với dropdown autocomplete và navigation
// Vị trí: src/components/ui/SearchBar.jsx
// ==========================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import bookService from '../../services/book.service';
import { searchBooks } from '../../utils/searchUtils';
import { getBookCoverUrl, FALLBACK_IMAGES } from '../../utils/imageUrl';

// ==========================================
// Helper: Highlight matching text
// ==========================================
const HighlightText = ({ text, query }) => {
    if (!query || !text) return <span>{text}</span>;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <mark key={index} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
};

// ==========================================
// Props:
// - placeholder: string - Placeholder text
// - value: string - Giá trị input (controlled)
// - onChange: function - Callback khi giá trị thay đổi
// - onSearch: function - Callback khi submit search (Enter)
// - onClose: function - Callback khi bấm nút X
// - className: string - Custom classes
// ==========================================

const SearchBar = ({
    placeholder = 'Tìm kiếm theo tên sách hoặc tác giả...',
    value: controlledValue,
    onChange,
    onSearch,
    onClose,
    className = '',
}) => {
    const navigate = useNavigate();

    // State
    const [internalValue, setInternalValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Refs
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const abortControllerRef = useRef(null);
    const cacheRef = useRef(new Map());

    // Controlled/Uncontrolled value
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    // ==========================================
    // Fetch suggestions from bookService
    // ==========================================
    const fetchSuggestions = useCallback(async (query) => {
        const trimmed = query.trim();

        // Reset if empty
        if (!trimmed) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        // Check cache first
        if (cacheRef.current.has(trimmed)) {
            setSuggestions(cacheRef.current.get(trimmed));
            setShowDropdown(true);
            return;
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setIsLoading(true);

        try {
            const response = await bookService.getAll({
                keyword: trimmed,
                limit: 6
            });

            // Extract books array from response
            let books = [];
            if (Array.isArray(response)) {
                books = response;
            } else if (response?.data && Array.isArray(response.data)) {
                books = response.data;
            } else if (response?.books && Array.isArray(response.books)) {
                books = response.books;
            }

            // Apply token-based filter on FE for better matching
            const results = searchBooks(books, trimmed).slice(0, 6);

            // Cache results
            cacheRef.current.set(trimmed, results);

            setSuggestions(results);
            setShowDropdown(results.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('[SearchBar] Error fetching suggestions:', error);
                setSuggestions([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);

        return () => clearTimeout(timer);
    }, [value, fetchSuggestions]);

    // ==========================================
    // Event Handlers
    // ==========================================

    // Input change
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (onChange) {
            onChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    // Form submit (Enter key) - navigate to search page
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDropdown(false);

        if (!value.trim()) return;

        // Call onSearch callback if provided (for search page)
        if (onSearch) {
            onSearch(value);
        }
    };

    // Click on suggestion - navigate to book detail
    const handleSuggestionClick = (book) => {
        const bookId = book.book_id || book.id;
        setShowDropdown(false);

        // Navigate to book detail page
        if (bookId) {
            navigate(`/books/${bookId}`);
        }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) {
            if (e.key === 'Escape') {
                setShowDropdown(false);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    e.preventDefault();
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowDropdown(false);
                break;
        }
    };

    // Close button
    const handleClose = () => {
        setShowDropdown(false);
        if (onClose) {
            onClose();
        }
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <form
                onSubmit={handleSubmit}
                className={`
                    relative flex items-center w-full
                    bg-white rounded-full
                    border border-border
                    shadow-sm
                    transition-shadow duration-200
                    hover:shadow-md focus-within:shadow-md focus-within:border-primary/30
                `}
            >
                {/* Search Icon */}
                <span className="absolute left-4 text-text-sub pointer-events-none">
                    <Search size={20} strokeWidth={2} />
                </span>

                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value.trim() && suggestions.length > 0 && setShowDropdown(true)}
                    placeholder={placeholder}
                    className="
                        w-full py-3 pl-12 pr-12
                        bg-transparent
                        text-text-primary text-sm
                        placeholder:text-text-sub/60
                        outline-none
                        rounded-full
                    "
                    autoComplete="off"
                />

                {/* Loading or Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="
                        absolute right-3
                        p-1.5
                        text-text-sub
                        hover:text-text-primary
                        transition-colors duration-200
                    "
                    aria-label="Đóng tìm kiếm"
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <X size={18} strokeWidth={2} />
                    )}
                </button>
            </form>

            {/* Dropdown Suggestions - TEMPORARILY DISABLED */}
            {false && showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
                    {isLoading && suggestions.length === 0 ? (
                        // Loading skeleton
                        <div className="p-3 space-y-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-3 animate-pulse">
                                    <div className="w-10 h-14 bg-gray-200 rounded" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : suggestions.length > 0 ? (
                        // Results list
                        <div className="max-h-80 overflow-y-auto">
                            <div className="p-2">
                                <p className="text-xs font-semibold text-text-sub uppercase px-2 py-1 mb-1">
                                    Kết quả tìm kiếm
                                </p>
                                {suggestions.map((book, idx) => (
                                    <button
                                        key={book.book_id || book.id || idx}
                                        onClick={() => handleSuggestionClick(book)}
                                        className={`
                                            w-full flex gap-3 p-2 rounded-lg transition-colors text-left
                                            ${selectedIndex === idx
                                                ? 'bg-primary/10 ring-1 ring-primary/20'
                                                : 'hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {/* Book Cover */}
                                        <img
                                            src={getBookCoverUrl(book.cover_url || book.coverImage || book.image)}
                                            alt={book.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = FALLBACK_IMAGES.bookPlaceholder;
                                            }}
                                            className="w-10 h-14 object-cover rounded shadow-sm"
                                        />
                                        {/* Book Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-text-primary line-clamp-1">
                                                <HighlightText text={book.title} query={value} />
                                            </h4>
                                            <p className="text-xs text-text-sub line-clamp-1">
                                                {book.authors?.[0]?.name || book.author || 'Không rõ tác giả'}
                                            </p>
                                            {book.categories?.[0]?.name && (
                                                <span className="inline-block mt-1 text-[10px] bg-gray-100 text-text-sub px-1.5 py-0.5 rounded">
                                                    {book.categories[0].name}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {/* Footer hint */}
                            <div className="border-t border-gray-100 px-3 py-2 bg-gray-50 text-xs text-text-sub">
                                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono text-[10px]">Enter</kbd>
                                {' '}để xem tất cả kết quả
                            </div>
                        </div>
                    ) : !isLoading && value.trim() ? (
                        // Empty state
                        <div className="p-6 text-center text-text-sub">
                            <Search size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Không tìm thấy sách phù hợp</p>
                            <p className="text-xs mt-1">Thử tìm với từ khóa khác</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

