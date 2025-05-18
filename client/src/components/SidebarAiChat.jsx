import { Bot, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AiChatModal from "./AiChatModal";
import { aiChatNavigation } from "../constants/navigation.constant";

const SidebarAiChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <>
      <motion.button
        className="w-full p-3 mb-2 flex items-center gap-3 bg-primary/10 hover:bg-primary/20 text-primary transition-all rounded-md"
        onClick={openChat}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <div className="size-10 lg:size-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot size={24} className="text-primary" />
          </div>
          <span className="absolute bottom-0 right-0 size-3 bg-primary rounded-full ring-2 ring-base-100 animate-pulse" />
        </div>

        <div className="flex flex-col text-left min-w-0 flex-1">
          <div className="font-medium truncate flex items-center gap-1">
            Chitty Agent
          </div>
          <div className="text-xs text-primary/80 h-4 flex items-center">
            Automate chats
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            className="flex items-center justify-center size-8 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors"
            title="Quick chat"
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent button click
              openChat();
            }}
          >
            <MessageSquare size={16} className="text-primary" />
          </button>

          <Link
            to={aiChatNavigation.href}
            className="flex items-center justify-center size-8 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors"
            title="Full AI chat page"
            onClick={(e) => e.stopPropagation()} // Prevent parent button click
          >
            <Bot size={16} className="text-primary" />
          </Link>
        </div>
      </motion.button>

      <AiChatModal isOpen={isOpen} onClose={closeChat} />
    </>
  );
};

export default SidebarAiChat;
