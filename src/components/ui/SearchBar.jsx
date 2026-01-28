// ==========================================
// Component: SearchBar
// Mô tả: Thanh tìm kiếm với icon search và nút đóng
// Vị trí: src/components/ui/SearchBar.jsx
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import aiService from '../../services/ai.service';
import { getBookCoverUrl, FALLBACK_IMAGES } from '../../utils/imageUrl';

// ==========================================
// Props:
// - placeholder: string - Placeholder text (default: "Tìm kiếm theo tên sách hoặc tác giả...")
// - value: string - Giá trị input (controlled)
// - onChange: function - Callback khi giá trị thay đổi
// - onSearch: function - Callback khi submit search
// - onClose: function - Callback khi bấm nút X để tắt/đóng search
// - className: string - Custom classes cho container
// ==========================================

const SearchBar = ({
    placeholder = 'Tìm kiếm theo tên sách hoặc tác giả...',
    value: controlledValue,
    onChange,
    onSearch,
    onClose,
    className = '',
}) => {
    // State nội bộ nếu không dùng controlled mode
    const [internalValue, setInternalValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const suggestionsCache = useRef(new Map()); // Cache for suggestions
    const searchCache = useRef(new Map());      // Cache for search results

    // Xác định giá trị hiển thị (controlled hoặc uncontrolled)
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    // Fetch suggestions khi người dùng nhập
    useEffect(() => {
        if (value.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const fetchSuggestions = async () => {
            const trimmedValue = value.trim();
            // Check cache first
            if (suggestionsCache.current.has(trimmedValue)) {
                setSuggestions(suggestionsCache.current.get(trimmedValue));
                setShowSuggestions(true);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                // Gọi AI để lấy gợi ý sách
                const response = await aiService.chat(
                    `Gợi ý 5 cuốn sách liên quan đến: "${value}". Trả về danh sách ISBN và tên sách.`,
                    'search-suggestions'
                );

                // Parse response để lấy identifiers
                if (response.sources && Array.isArray(response.sources)) {
                    const bookSources = response.sources.slice(0, 5);
                    
                    // Fetch book details từ API
                    const identifiers = bookSources
                        .map(s => s.identifier || s.bookId)
                        .filter(Boolean);
                    
                    if (identifiers.length > 0) {
                        const booksData = await aiService.getBooksByIdentifiers(identifiers);
                        const booksArray = Array.isArray(booksData) ? booksData : (booksData?.data || []);
                        const results = booksArray.slice(0, 5);
                        
                        setSuggestions(results);
                        setShowSuggestions(true);
                        
                        // Cache the results
                        suggestionsCache.current.set(trimmedValue, results);
                    }
                }
            } catch (error) {
                console.error('[SearchBar] Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300); // Debounce 300ms
        return () => clearTimeout(timer);
    }, [value]);

    // Handle input change
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (onChange) {
            onChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (book) => {
        const searchTerm = book.title || '';
        if (onChange) {
            onChange(searchTerm);
        } else {
            setInternalValue(searchTerm);
        }
        setShowSuggestions(false);
        
        // Pass book as source when clicking suggestion
        if (onSearch) {
            onSearch(searchTerm, [book]);
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };

        if (showSuggestions) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSuggestions]);

    // Handle form submit - gọi AI để lấy sách gợi ý
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        
        if (!value.trim()) return;

        // Check search cache
        const trimmedValue = value.trim();
        if (searchCache.current.has(trimmedValue)) {
            const cachedSources = searchCache.current.get(trimmedValue);
             if (onSearch) {
                onSearch(value, cachedSources);
            }
            return;
        }

        setIsLoadingSuggestions(true);
        try {
            // Gọi AI để lấy sách liên quan
            const response = await aiService.chat(value, 'search-query');
            
            // Extract sources từ response
            const sources = response.sources || response?.data?.sources || [];
            
            if (sources && sources.length > 0) {
                // Lấy identifiers từ sources
                const identifiers = sources
                    .map(source => source.identifier || source.bookId || source.id)
                    .filter(Boolean);

                if (identifiers.length > 0) {
                    // Fetch full book data từ API (giống như chatbot)
                    const booksData = await aiService.getBooksByIdentifiers(identifiers);
                    const booksArray = Array.isArray(booksData) ? booksData : (booksData?.data || []);
                    
                    // Enrich sources với full book data
                    const enrichedSources = sources.map((source, index) => {
                        const matchedBook = booksArray.find(book => 
                            (book.isbn || book.book_id) === (source.identifier || source.bookId || source.id)
                        ) || booksArray[index];

                        return {
                            ...matchedBook,
                            ...source,
                            id: matchedBook?.book_id || matchedBook?.id || source.id,
                        };
                    }).filter(book => book !== null);

                    // Cache results
                    searchCache.current.set(trimmedValue, enrichedSources);

                    // Gọi callback với search term và full book data
                    if (onSearch) {
                        onSearch(value, enrichedSources);
                    }
                } else {
                     // Cache simple sources
                    searchCache.current.set(trimmedValue, sources);

                    // Không có identifiers, gửi sources như cũ
                    if (onSearch) {
                        onSearch(value, sources);
                    }
                }
            } else {
                // Không có sources, submit mà không sources
                if (onSearch) {
                    onSearch(value, []);
                }
            }
        } catch (error) {
            console.error('[SearchBar] Error submitting search:', error);
            // Fallback: submit without sources
            if (onSearch) {
                onSearch(value, []);
            }
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    // Handle close button click - tắt chức năng search
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className={`relative ${className}`}>
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
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => value.trim().length >= 2 && setShowSuggestions(true)}
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
                    {isLoadingSuggestions ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <X size={18} strokeWidth={2} />
                    )}
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                    <div className="p-2">
                        <p className="text-xs font-semibold text-text-sub uppercase px-2 py-1 mb-1">
                            Gợi ý từ AI
                        </p>
                        {suggestions.map((book, idx) => (
                            <button
                                key={`${book.id || idx}`}
                                onClick={() => handleSuggestionClick(book)}
                                className="w-full flex gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors mb-1 text-left"
                            >
                                {/* Book Cover */}
                                <img
                                    src={getBookCoverUrl(book.cover_url || book.coverImage)}
                                    alt={book.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = FALLBACK_IMAGES.bookPlaceholder;
                                    }}
                                    className="w-10 h-14 object-cover rounded"
                                />
                                {/* Book Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-text-primary line-clamp-1">
                                        {book.title}
                                    </h4>
                                    <p className="text-xs text-text-sub line-clamp-1">
                                        {Array.isArray(book.authors)
                                            ? book.authors.map(a => a.name).join(', ')
                                            : book.author || 'Unknown'}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
