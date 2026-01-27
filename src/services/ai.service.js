// ==========================================
// AI Service
// Service layer for interacting with AI endpoints
// ==========================================

import axios from './axios';

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

const aiService = {
    chat,
};

export default aiService;
