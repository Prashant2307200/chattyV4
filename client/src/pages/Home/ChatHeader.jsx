// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { X, ArrowLeft, Users } from "lucide-react";

import { formatNumber } from "../../utils/formatUtils";
import { useSocketStore } from "../../store/useSocketStore";

const ChatHeader = ({ onMobileBack }) => {

  const { selectedChat, socket, unsubscribeFromChat, onlineUsers } = useSocketStore();

  const [isTyping, setIsTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState({});

  const user = selectedChat?.isGroupChat ? null : selectedChat?.participants?.[0];
  const isGroup = selectedChat?.isGroupChat;

  // Listen for typing events
  useEffect(() => {
    if (!socket || !selectedChat || !user) return;

    const handleUserTyping = (data) => {
      if (data.userId === user._id && data.chatId === selectedChat._id) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (data) => {
      if (data.userId === user._id && data.chatId === selectedChat._id) {
        setIsTyping(false);
      }
    };

    const handleUserLastSeen = (data) => {
      if (data.userId === user._id) {
        setLastSeen(prev => ({
          ...prev,
          [user._id]: data.timestamp
        }));
      }
    };

    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);
    socket.on("userLastSeen", handleUserLastSeen);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.off("userLastSeen", handleUserLastSeen);
    };
  }, [socket, selectedChat, user]);

  // Format the last seen time
  const getLastSeenText = () => {
    if (!user || !lastSeen[user._id]) return "Offline";

    try {
      return `Last seen ${formatDistanceToNow(new Date(lastSeen[user._id]), { addSuffix: true })}`;
    } catch (error) {
      console.log(error)
      return "Offline";
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          <motion.button
            className="md:hidden btn btn-sm btn-ghost btn-circle mr-1"
            onClick={() => {
              // If onMobileBack is provided, use it (for mobile view)
              if (onMobileBack) {
                unsubscribeFromChat()
                onMobileBack();
              } else {
                unsubscribeFromChat()
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft size={18} />
            </motion.div>
          </motion.button>

          {/* Avatar */}
          {isGroup ? (
            <div className="avatar-group -space-x-6">
              {selectedChat?.participants?.slice(0, 3).map((participant, index) => (
                <div key={participant._id} className="avatar size-10">
                  <div className="rounded-full ring-2 ring-white">
                    <img
                      className="object-cover w-full h-full rounded-full"
                      src={participant?.profilePic || "/avatar.png"}
                      alt={participant?.username || `User ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
              {selectedChat?.participants?.length > 3 && (
                <div className="avatar size-10">
                  <div className="rounded-full bg-primary text-primary-content ring-2 ring-white flex items-center justify-center">
                    <span className="text-xs font-medium">+{selectedChat.participants.length - 3}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img src={user?.profilePic || "/avatar.png"} alt={user?.username} />
              </div>
              {user && onlineUsers.includes(user._id) && (
                <span className="z-10 absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>
          )}

          {/* User/Group info */}
          <div>
            {isGroup ? (
              <>
                <h3 className="font-medium flex items-center gap-2">
                  {selectedChat?.name || "Group Chat"}
                  <span className="badge badge-sm badge-primary flex items-center gap-1">
                    <Users size={12} />
                    {formatNumber(selectedChat?.participants?.length || 0)}
                  </span>
                </h3>
                <p className="text-sm text-base-content/70">
                  {formatNumber(selectedChat?.participants?.length || 0, true)}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-medium">{user?.username}</h3>
                {/* Fixed height container for status to prevent layout shifts */}
                <div className="h-5 flex items-center">
                  {isTyping ? (
                    <p className="text-sm text-primary animate-pulse">
                      typing...
                    </p>
                  ) : (
                    <p className="text-sm text-base-content/70">
                      {onlineUsers.includes(user?._id) ? "Active now" : getLastSeenText()}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Close button - only visible on desktop */}
        <motion.button
          className="hidden md:flex btn btn-sm btn-error btn-outline gap-2"
          onClick={unsubscribeFromChat}
          aria-label="Close chat"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {useMemo(() => <X size={16} />, [])}
          </motion.div>
          <span className="hidden lg:inline-block">Close</span>
        </motion.button>
      </div>
    </div>
  );
};
export default ChatHeader;
