import { useEffect } from "react";
import AiChat from "../Home/AiChat";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Bot, ArrowLeft } from "lucide-react";

const AiChatPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "AI Assistant | Chatty";
    return () => {
      document.title = "Chatty";
    };
  }, []);
  
  return (
    <main className="h-screen bg-base-200">
      <section className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-2xl h-[calc(100vh-8rem)]">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-base-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link to="/" className="btn btn-sm btn-ghost btn-circle">
                    <ArrowLeft size={18} />
                  </Link>
                </motion.div>
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Chitty AI Agent</h2>
                    <p className="text-sm text-base-content/70">Ask me about your chats</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Chat */}
            <div className="flex-1 overflow-hidden">
              <AiChat onClose={() => {}} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AiChatPage;
