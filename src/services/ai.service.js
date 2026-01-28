// ==========================================
// AI Service
// Service layer for interacting with AI endpoints
// ==========================================

import axios from './axios';
import { getBooksByIdentifiers as fetchBooksWithCache } from './book.service';


/**
 * Send a message to the AI chat
 * @param {string} message - The user's message
 * @param {string} sessionId - The session ID
 * @param {number} topK - Number of results (default 5)
 * @returns {Promise<Object>} The AI response
 */
export const chat = async (message, sessionId, topK = 5) => {
    // Correct endpoint based on user request: /ai/chat
    const response = await axios.post('/ai/chat', {
        message,
        session_id: sessionId,
        top_k: topK
    });
    return response.data;
};

/**
 * Fetch book details by ISBN identifiers
 * Delegates to book.service which handles caching
 * @param {Array<string|number>} ids - Array of ISBN identifiers
 * @returns {Promise<Array>} Array of book objects with full details
 */
export const getBooksByIdentifiers = async (ids) => {
    // Delegate to book service to use centralized cache
    return fetchBooksWithCache(ids);
};


const aiService = {
    chat,
    getBooksByIdentifiers,
};

export default aiService;
