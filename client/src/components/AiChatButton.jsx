import { Bot } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import AiChatModal from "./AiChatModal";

const AiChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  
  return (
    <>
      <motion.button
        className="btn btn-circle btn-primary"
        onClick={openChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <Bot size={24} />
      </motion.button>
      
      <AiChatModal isOpen={isOpen} onClose={closeChat} />
    </>
  );
};

export default AiChatButton;
