// ==========================================
// Utility: searchUtils.js
// Mô tả: Token-based search utilities for book filtering
// Hỗ trợ tiếng Việt có dấu và không dấu
// ==========================================

/**
 * Remove Vietnamese diacritics from a string
 * Sử dụng Unicode NFD normalization để tách dấu khỏi ký tự gốc
 * @param {string} str - Input string
 * @returns {string} String without diacritics
 */
export const removeDiacritics = (str) => {
    if (!str || typeof str !== 'string') return '';

    // NFD: Decompose characters into base + combining marks
    // Then remove combining diacritical marks (Unicode range 0300-036f)
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Handle special Vietnamese characters that don't decompose properly
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

/**
 * Normalize a string for search comparison
 * - Remove diacritics (Vietnamese support)
 * - Lowercase
 * - Trim whitespace
 * - Remove extra spaces
 */
export const normalizeForSearch = (text) => {
    if (!text || typeof text !== 'string') return '';
    return removeDiacritics(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Split search query into tokens (words)
 * @param {string} query - Search query
 * @returns {string[]} Array of normalized tokens
 */
export const tokenizeQuery = (query) => {
    if (!query || typeof query !== 'string') return [];
    return normalizeForSearch(query)
        .split(' ')
        .filter(token => token.length > 0);
};

/**
 * Check if any token from the query matches part of the target string
 * @param {string} target - Target string to search in (e.g., title, author)
 * @param {string[]} tokens - Array of search tokens (already normalized)
 * @returns {boolean} True if at least one token matches
 */
export const matchesAnyToken = (target, tokens) => {
    if (!target || tokens.length === 0) return false;
    const normalizedTarget = normalizeForSearch(target);
    return tokens.some(token => normalizedTarget.includes(token));
};

/**
 * Check if a book matches the search query using token-based matching
 * Matches if any token is found in title OR author
 * Supports Vietnamese with/without diacritics
 * @param {Object} book - Book object with title and author fields
 * @param {string} query - Search query string
 * @returns {boolean} True if book matches
 */
export const bookMatchesQuery = (book, query) => {
    if (!book || !query) return false;

    const tokens = tokenizeQuery(query);
    if (tokens.length === 0) return true; // Empty query matches all

    // Extract title
    const title = book.title || '';

    // Extract author (handle multiple formats)
    const author =
        book.authors?.[0]?.name ||
        book.author?.name ||
        book.authorName ||
        book.author ||
        '';

    // Match if any token found in title OR author
    return matchesAnyToken(title, tokens) || matchesAnyToken(author, tokens);
};

/**
 * Filter an array of books by search query using token-based matching
 * @param {Object[]} books - Array of book objects
 * @param {string} query - Search query string
 * @returns {Object[]} Filtered books array
 */
export const filterBooksByQuery = (books, query) => {
    if (!Array.isArray(books)) return [];
    if (!query || !query.trim()) return books;

    return books.filter(book => bookMatchesQuery(book, query));
};

/**
 * Score a book's relevance to search query
 * Higher score = more relevant (more tokens matched, earlier in title)
 * @param {Object} book - Book object
 * @param {string} query - Search query
 * @returns {number} Relevance score
 */
export const getBookRelevanceScore = (book, query) => {
    if (!book || !query) return 0;

    const tokens = tokenizeQuery(query);
    if (tokens.length === 0) return 0;

    const title = normalizeForSearch(book.title || '');
    const author = normalizeForSearch(
        book.authors?.[0]?.name ||
        book.author?.name ||
        book.authorName ||
        book.author ||
        ''
    );

    let score = 0;

    tokens.forEach(token => {
        // Title match scores higher
        if (title.includes(token)) {
            score += 10;
            // Bonus for match at start of title
            if (title.startsWith(token)) {
                score += 5;
            }
        }
        // Author match
        if (author.includes(token)) {
            score += 5;
        }
    });

    return score;
};

/**
 * Filter and sort books by relevance to search query
 * Supports Vietnamese with/without diacritics
 * @param {Object[]} books - Array of book objects
 * @param {string} query - Search query string
 * @returns {Object[]} Filtered and sorted books array
 */
export const searchBooks = (books, query) => {
    if (!Array.isArray(books)) return [];
    if (!query || !query.trim()) return books;

    return books
        .filter(book => bookMatchesQuery(book, query))
        .map(book => ({
            ...book,
            _relevanceScore: getBookRelevanceScore(book, query)
        }))
        .sort((a, b) => b._relevanceScore - a._relevanceScore);
};
