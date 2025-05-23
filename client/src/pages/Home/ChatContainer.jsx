// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

import MessageInput from "./MessageInput";
import { formatMessageTime } from "../../lib/util";
import { useApiQuery } from "../../hooks/useApiQuery";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useSocketStore } from "../../store/useSocketStore";

const ChatContainer = ({ children }) => {

  const { selectedChat } = useSocketStore();

  const { data: authUser } = useApiQuery({ keys: ["authUser"], path: '/auth/check' });

  const { data: messages, isLoading: isMessagesLoading } = useApiQuery({
    keys: ["chats", `${selectedChat?._id}`],
    path: `/chats/${selectedChat?._id}`,
    enabled: !!selectedChat?._id
  });
  
  const messageEndRef = useRef(null);
  
  useEffect(() => {
    if (messageEndRef.current && messages?.length)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);
  
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="mb-auto">
          {children}
        </div>
        <div className="flex-1 overflow-y-auto">
          <MessageSkeleton />
        </div>
        <div className="mt-auto">
          <MessageInput />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">

      <div className="mb-auto">  
        {children}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message, index) => {

          const isLastMessage = index === messages.length - 1;

          return (
            <section
              className="overflow-hidden"
              key={message._id || `temp-${index}`}
              ref={isLastMessage ? messageEndRef : null}
            >
              <motion.div className={`chat ${message.sender._id === authUser._id ? "chat-end" : "chat-start"} overflow-hidden`}
                initial={{
                  opacity: 0,
                  x: message.sender._id === authUser._id ? "100%" : "-100%"
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={message.sender?.profilePic || "/avtar.png"}
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  {message.sender._id === authUser._id ? "You" : message.sender.username}
                  {message?.isSending !== true ? <time className="text-xs opacity-50 ml-1">{formatMessageTime(message?.createdAt)}</time> : <span>Sending...</span>}
                </div>
                <div className={`chat-bubble flex flex-col ${(message.sender._id === authUser._id) && "bg-primary text-primary-content"}`}>
                  {message.image && (
                    <img className="sm:max-w-[200px] rounded-md mb-2"
                      src={message.image}
                      alt="Attachment"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </motion.div>
            </section>
          );
        })} 
      </div>

      <div className="mt-auto">
        <MessageInput />
      </div>
    </div>
  );
};
export default ChatContainer;