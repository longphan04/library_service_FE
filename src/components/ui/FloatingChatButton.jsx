import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import useChat from '@/hooks/useChat';
import ChatModal from './ChatModal';
import { useBookDetail } from '@/contexts/BookDetailContext';

const FloatingChatButton = () => {
    const {
        messages,
        isLoading,
        isOpen,
        toggleChat,
        sendMessage
    } = useChat();

    const { openBookDetail } = useBookDetail();

    return (
        <>
            {/* Chat Modal */}
            <ChatModal
                isOpen={isOpen}
                onClose={toggleChat}
                messages={messages}
                isLoading={isLoading}
                onSendMessage={sendMessage}
                openBookAuth={openBookDetail}
            />

            {/* Toggle Button - Only show when chat is closed */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 bg-primary hover:bg-primary-hover hover:scale-110 text-white"
                    aria-label="Mở chat hỗ trợ"
                >
                    <MessageCircle size={24} />
                </button>
            )}
        </>
    );
};

export default FloatingChatButton;
