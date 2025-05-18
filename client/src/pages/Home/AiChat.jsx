import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";

import { formatMessageTime } from "../../lib/util"; 
import { useSocketStore } from "../../store/useSocketStore";

const AiChat = ({ onClose }) => {

  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { 
    aiState: {
      messages, 
      isLoading
    },
    sendMessage,
    subscribeToAiEvents,
    unsubscribeFromAiEvents
  } = useSocketStore();

  useEffect(() => {
    subscribeToAiEvents(); 
    inputRef.current?.focus();
    return () => unsubscribeFromAiEvents()
  }, [subscribeToAiEvents, unsubscribeFromAiEvents]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    sendMessage(inputText);
    setInputText("");
  };

  const showWelcomeMessage = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Chitty AI Agent</h3>
              <p className="text-sm text-base-content/70">
                {isLoading ? (
                  <span className="text-primary animate-pulse">typing...</span>
                ) : (
                  "Ask me about your chats"
                )}
              </p>
            </div>
          </div>

          {/* Close button */}
          <motion.button
            className="btn btn-sm btn-ghost btn-circle"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {showWelcomeMessage && (
          <motion.div
            className="chat chat-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="chat-header mb-1">
              Chitty AI Agent
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(new Date())}</time>
            </div>
            <div className="chat-bubble bg-base-200">
              <p>Hi there! I'm your Chatty AI Assistant. I can help you with information about your chats. Try asking me:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>How many chats do I have?</li>
                <li>Show me my chats</li>
                <li>Who am I chatting with?</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Message list */}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`chat ${message.isUser ? "chat-end" : "chat-start"}`}
              initial={{
                opacity: 0,
                x: message.isUser ? 20 : -20
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chat-image avatar">
                <div className={`w-10 h-10 rounded-full ${message.isUser ? "bg-secondary/10" : "bg-primary/10"} flex items-center justify-center`}>
                  {message.isUser ? (
                    <div className="font-bold text-secondary">You</div>
                  ) : (
                    <Bot className="w-6 h-6 text-primary" />
                  )}
                </div>
              </div>
              <div className="chat-header mb-1">
                {message.isUser ? "You" : "Chitty AI"}
                <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.timestamp)}</time>
              </div>
              <div className={`chat-bubble ${message.isUser ? "bg-secondary text-secondary-content" : message.isError ? "bg-error text-error-content" : "bg-base-200"}`}>
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && !messages.some(m => !m.isUser && m.timestamp > Date.now() - 2000) && (
          <motion.div
            className="chat chat-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="chat-bubble bg-base-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </motion.div>
        )}

        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-base-300">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask me about your chats..."
            className="input input-bordered flex-1 rounded-lg input-sm sm:input-md"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            ref={inputRef}
          />
          <button
            type="submit"
            className={`btn btn-sm btn-circle ${isLoading ? "btn-disabled" : "bg-primary"}`}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChat;
