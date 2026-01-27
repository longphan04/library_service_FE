import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import aiService from '../services/ai.service';
import bookService from '../services/book.service';
import { useAuth } from './useAuth';

const SESSION_STORAGE_KEY = 'library_chat_session_id';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_STORAGE_KEY) || null);
    const [isOpen, setIsOpen] = useState(false);

    // Use ref to access latest sessionId inside useCallback without adding it to dependency array if handled internally
    const sessionIdRef = useRef(sessionId);

    const { isAuthenticated } = useAuth();

    // Initialize or reset session
    useEffect(() => {
        let currentSessionId = localStorage.getItem(SESSION_STORAGE_KEY);

        // If no session exists or user logged out/changed (triggering a reset logic if desired)
        if (!currentSessionId) {
            currentSessionId = uuidv4();
            localStorage.setItem(SESSION_STORAGE_KEY, currentSessionId);
        }

        // If isAuthenticated changes, reset session
        if (!isAuthenticated) {
            setMessages([]);
            currentSessionId = uuidv4();
            localStorage.setItem(SESSION_STORAGE_KEY, currentSessionId);
        }

        setSessionId(currentSessionId);
        sessionIdRef.current = currentSessionId;
    }, [isAuthenticated]);

    // Keep ref in sync
    useEffect(() => {
        sessionIdRef.current = sessionId;
    }, [sessionId]);

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return;

        // Defensive: user might send before session init
        let activeSessionId = sessionIdRef.current;
        if (!activeSessionId) {
            activeSessionId = uuidv4();
            setSessionId(activeSessionId);
            localStorage.setItem(SESSION_STORAGE_KEY, activeSessionId);
            sessionIdRef.current = activeSessionId;
        }

        const userMessageId = uuidv4();
        const userMessage = {
            id: userMessageId,
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Call API
            const response = await aiService.chat(text, activeSessionId, 5);
            console.log('AI Response:', response);

            // Access nested data if it exists (API returns { data: { answer: ... } })
            const responseData = response.data || response;

            // Defensive programming: Extract content
            // Priority: answer > content > result > message (if not 'ok')
            let content = responseData.answer || responseData.content || responseData.result;

            if (!content) {
                if (responseData.message && responseData.message.toLowerCase() !== 'ok') {
                    content = responseData.message;
                } else if (response.message && response.message.toLowerCase() !== 'ok') {
                    content = response.message;
                } else {
                    // Fallback to raw JSON if specific fields are missing
                    content = JSON.stringify(response, null, 2);
                }
            }

            const botMessageId = uuidv4();
            const botMessage = {
                id: botMessageId,
                role: 'assistant',
                content: content,
                sources: [],
                timestamp: new Date().toISOString(),
                isLoadingSources: true
            };

            // 1. Display text IMMEDIATELY
            setMessages((prev) => [...prev, botMessage]);
            setIsLoading(false); // Stop main loading indicator

            // 2. Process sources in BACKGROUND (Non-blocking)
            const sources = responseData.sources || response.sources;

            if (sources && Array.isArray(sources) && sources.length > 0) {

                // Fetch books
                const fetchBooks = async () => {
                    const bookPromises = sources.map(async (source) => {
                        const identifier = source.identifier || source.bookId || source.id;

                        // If no identifier, we can't look it up, but we can still display the card from source info
                        if (!identifier) {
                            return {
                                ...source,
                                isNotFound: true, // Flag to indicate we can't open details
                                id: uuidv4(), // Generate temp ID for key
                            };
                        }

                        try {
                            const book = await bookService.getById(identifier);
                            return {
                                ...book,
                                score: source.score, // Preserve score from AI source
                                category: book.category?.name || source.category, // Prefer DB category name
                            };
                        } catch (error) {
                            console.warn(`Book not found: ${identifier}`, error);
                            return {
                                id: identifier,
                                title: source.title || "Sách không tìm thấy",
                                isNotFound: true,
                                ...source
                            };
                        }
                    });

                    const results = await Promise.all(bookPromises);
                    const enrichedSources = results.filter((book) => book !== null);

                    // Update the existing message with sources
                    setMessages((prev) => prev.map(msg =>
                        msg.id === botMessageId
                            ? { ...msg, sources: enrichedSources, isLoadingSources: false }
                            : msg
                    ));
                };

                // Trigger fetch without awaiting it for the main UI thread
                fetchBooks();
            } else {
                setMessages((prev) => prev.map(msg =>
                    msg.id === botMessageId
                        ? { ...msg, isLoadingSources: false }
                        : msg
                ));
            }

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: uuidv4(),
                role: 'assistant',
                content: "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
                isError: true,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            setIsLoading(false);
        }
    }, []);

    return {
        messages,
        isLoading,
        isOpen,
        toggleChat,
        sendMessage
    };
};

export default useChat;
