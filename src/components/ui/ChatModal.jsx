import { useRef, useEffect, useState } from 'react';
import { X, Send, Bot, User, Loader2, Minus } from 'lucide-react';
import ChatBookCard from './Chat/ChatBookCard';

const ChatModal = ({ isOpen, onClose, messages = [], isLoading = false, onSendMessage, openBookAuth }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        onSendMessage(inputText);
        setInputText('');
    };

    const handleBookClick = (book) => {
        // Book ID might be in different fields depending on API but useChat attempts to normalize or return full object
        // bookService.getById returns book_id usually
        const bookId = book.book_id || book.id || book._id;
        if (openBookAuth && bookId) {
            openBookAuth(bookId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-in fade-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-xl text-white shadow-sm">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary text-sm sm:text-base">Trợ lý Thư viện AI</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                            <span className="text-[10px] sm:text-xs text-text-sub font-medium">Đang hoạt động</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-black/5 rounded-lg text-text-sub hover:text-text-primary transition-colors"
                        aria-label="Thu nhỏ"
                    >
                        <Minus size={18} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-text-sub hover:text-red-500 transition-colors"
                        aria-label="Đóng chat"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 scroll-smooth">
                {messages.length === 0 && (
                    <div className="text-center py-8 space-y-3">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                            <Bot size={32} />
                        </div>
                        <p className="text-sm text-text-primary font-medium">Xin chào! Tôi có thể giúp gì cho bạn?</p>
                        <p className="text-xs text-text-sub max-w-[80%] mx-auto">
                            Bạn có thể hỏi về sách, tác giả, hoặc nhờ gợi ý sách hay.
                        </p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`group flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1
                            ${msg.role === 'user'
                                ? 'bg-white border border-border text-text-sub'
                                : 'bg-primary text-white'
                            }
                        `}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        {/* Content Container */}
                        <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {/* Message Bubble */}
                            <div className={`
                                p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-sm'
                                    : 'bg-white border border-border text-text-primary rounded-tl-sm'
                                }
                                ${msg.isError ? 'bg-red-50 text-red-600 border-red-100' : ''}
                            `}>
                                {msg.content}
                            </div>

                            {/* Book Sources */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 space-y-2 w-full">
                                    <p className="text-[10px] font-semibold text-text-sub uppercase tracking-wider pl-1">
                                        Sách được đề xuất
                                    </p>
                                    <div className="flex gap-2 w-full overflow-x-auto pb-2 -mx-2 px-2 snap-x scrollbar-hide">
                                        {msg.sources.map((book, idx) => (
                                            <ChatBookCard
                                                key={`${book.id || idx}`}
                                                book={book}
                                                onClick={handleBookClick}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Timestamp */}
                            <span className="text-[10px] text-text-sub px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white border border-border p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-primary" />
                            <span className="text-xs text-text-sub font-medium">Đang suy nghĩ...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-white rounded-b-2xl">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        disabled={isLoading}
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isLoading}
                        className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatModal;
