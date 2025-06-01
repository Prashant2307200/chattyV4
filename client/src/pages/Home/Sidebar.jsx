import { formatDistanceToNow } from "date-fns";
import { Users, X, UserPlus } from "lucide-react";
import { memo, useState, useMemo, useEffect } from "react";

import { useApiQuery } from "../../hooks/useApiQuery";
import { formatNumber } from "../../utils/formatUtils";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import SidebarAiChat from "../../components/SidebarAiChat";
import { useSocketStore } from "../../store/useSocketStore";
import CreateGroupChatButton from "../../components/CreateGroupChatButton";

import { useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const Sidebar = memo(({ onChatSelect, data: chats, isLoading }) => {

  const { onlineUsers, subscribeToChat, unsubscribeFromChat, selectedChat, socket } = useSocketStore();

  const queryClient = useQueryClient();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSeen, setLastSeen] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.userId]: {
          chatId: data.chatId,
          isTyping: true
        }
      }));
    };

    const handleUserStoppedTyping = (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.userId]: {
          chatId: data.chatId,
          isTyping: false
        }
      }));
    };

    const handleUserLastSeen = (data) => {
      setLastSeen(prev => ({
        ...prev,
        [data.userId]: data.timestamp
      }));
    };

    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);
    socket.on("userLastSeen", handleUserLastSeen);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.off("userLastSeen", handleUserLastSeen);
    };
  }, [socket]);

  // Format the last seen time
  const getLastSeenText = (userId) => {
    if (!lastSeen[userId]) return "Offline";

    try {
      return formatDistanceToNow(new Date(lastSeen[userId]), { addSuffix: true });
    } catch (error) {
      console.log(error)
      return "Offline";
    }
  };

  const memoizedUsersIcon = useMemo(() => <Users className="size-6" />, []);

  // Process chats to remove duplicates for one-on-one chats
  const processedChats = useMemo(() => {
    if (!chats) return [];

    const userToLatestChat = new Map();

    chats.forEach(chat => {

      if (chat.isGroupChat) return;

      const otherUser = chat.participants[0];
      if (!otherUser) return;

      const userId = otherUser._id;

      const existingChat = userToLatestChat.get(userId);
      if (!existingChat || new Date(chat.createdAt) > new Date(existingChat.createdAt)) {
        userToLatestChat.set(userId, chat);
      }
    });

    return chats.filter(chat => {
      // Always keep group chats
      if (chat.isGroupChat) return true;

      const otherUser = chat.participants[0];
      if (!otherUser) return false;

      const userId = otherUser._id;

      const latestChat = userToLatestChat.get(userId);
      return latestChat && latestChat._id === chat._id;
    });
  }, [chats]);

  const filteredChats = useMemo(() => {
    if (!processedChats) return [];

    return processedChats.filter(chat => {
      // First apply online filter if enabled
      if (showOnlineOnly && !chat.isGroupChat && !onlineUsers.includes(chat.participants[0]?._id)) {
        return false;
      }

      // Then apply search filter if there's a query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();

        // For group chats, search in the group name
        if (chat.isGroupChat) {
          return chat.name?.toLowerCase().includes(query) ||
            // Also search in participant usernames
            chat.participants.some(p => p.username.toLowerCase().includes(query));
        }

        // For one-on-one chats, search in the username
        return chat.participants[0]?.username.toLowerCase().includes(query);
      }

      // If we get here, the chat passed all filters
      return true;
    });
  }, [processedChats, showOnlineOnly, onlineUsers, searchQuery]);

  if (isLoading) return <SidebarSkeleton />;
  return (
    <div className="h-full overflow-hidden">
      <aside className="h-full w-full lg:w-72 flex flex-col transition-all duration-200 overflow-hidden flex-shrink-0">
        <div className="border-b border-base-300 w-full p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                {memoizedUsersIcon}
                <div className="absolute -top-1 -right-1 size-4 bg-primary text-primary-content text-[10px] font-bold rounded-full flex items-center justify-center">
                  {filteredChats?.length || 0}
                </div>
              </div>
              <div>
                <span className="font-medium block">Chats</span>
                <span className="text-xs text-zinc-400">{formatNumber(filteredChats?.length || 0, true)}</span>
              </div>
            </div>
            <CreateGroupChatButton />
          </div>
          {/* Online filter toggle */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2">
                <input className="checkbox checkbox-xs checkbox-primary"
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                />
                <span className="text-xs">Show online only</span>
              </label>
              <div className="badge badge-sm badge-success">{formatNumber(onlineUsers.length - 1)} online</div>
            </div>
            <div className="text-xs text-zinc-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Friends summary */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <UserPlus size={14} className="text-primary" />
                <span className="text-xs font-medium">Friends</span>
              </div>
              <div className="badge badge-sm badge-primary">{formatNumber(filteredChats?.filter(chat => !chat.isGroupChat).length || 0)}</div>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} className="text-primary" />
              <span className="text-xs font-medium">Groups</span>
              <div className="badge badge-sm badge-secondary">{formatNumber(filteredChats?.filter(chat => chat.isGroupChat).length || 0)}</div>
            </div>
          </div>

          {/* Search box */}
          <div className="mt-3 block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                className="input input-sm input-bordered w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full py-3">
          
          <div className="px-3 mb-3">
            <SidebarAiChat />
          </div>

          {/* Divider */}
          <div className="divider my-1 px-3">
            <span className="text-xs text-base-content/50">Your Chats</span>
          </div>

          {!filteredChats || filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-6">
              <div className="text-center py-2">
                {searchQuery ? (
                  <>
                    <p className="text-zinc-500 text-sm">No results found for <span className="font-medium text-primary">'{searchQuery}'</span></p>
                    <button
                      className="btn btn-xs btn-ghost mt-2"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <p className="text-zinc-500 text-sm">
                    {showOnlineOnly ? "No online users" : "No chats found"}
                  </p>
                )}
              </div>
              <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mx-auto mt-2">
                <Users className="w-8 h-8 text-zinc-500" />
              </div>
            </div>
          ) : (
            filteredChats.map((chat, index) => {

              const user = chat.isGroupChat ? null : chat.participants[0];
              const isGroup = chat.isGroupChat;

              return (
                <div className="overflow-hidden">
                  <motion.button
                    className={`w-full p-3 mb-2 lg:mb-1 flex items-center gap-3 hover:bg-base-300 transition-all relative
                    ${selectedChat?._id === chat._id ? "bg-base-300 border-l-4 border-primary" : "border-l-4 border-transparent"}
                  `}
                    initial={{
                      opacity: 0,
                      y: "-20px"
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: .05 * index }}
                    key={chat._id}
                    onClick={() => { ;
                      unsubscribeFromChat();
                      subscribeToChat(chat, queryClient);
                      if (onChatSelect) onChatSelect();
                    }}
                  >
                    {isGroup ? (
                      <div className="relative mx-auto lg:mx-0">
                        {/* Avatar Stack */}
                        <div className="flex -space-x-4 w-fit">
                          {chat.participants.slice(0, 2).map((participant, idx) => (
                            <div key={participant._id} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-transparent">
                              <img className="w-full h-full object-cover"
                                src={participant?.profilePic || "/avatar.png"}
                                alt={participant?.username || `User ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Group Icon Badge */}
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-content text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          <Users size={12} />
                        </div>
                      </div>
                    ) : (
                      <div className="relative mx-auto lg:mx-0">
                        <img className="size-10 lg:size-12 object-cover rounded-full border-2 border-transparent hover:border-primary transition-colors"
                          src={user.profilePic || "/avatar.png"}
                          alt={user.username}
                        />
                        {onlineUsers.includes(user._id) && (
                          <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                        )} 
                      </div>
                    )}

                    <div className="flex flex-col text-left min-w-0 flex-1">
                      {isGroup ? (
                        <>
                          <div className="flex items-center gap-1">
                            <div className="font-medium truncate">{chat.name || "Group Chat"}</div>
                            <div className="badge badge-sm badge-primary">{chat.participants.length}</div>
                          </div>
                          <div className="text-xs text-zinc-400 truncate">
                            {chat.participants.map(p => p.username).join(", ").substring(0, 30)}
                            {chat.participants.map(p => p.username).join(", ").length > 30 ? "..." : ""}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-medium truncate flex items-center gap-1">
                            {user.username}
                            {onlineUsers.includes(user._id) && (
                              <div className="size-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <div className="text-xs text-zinc-400 h-4 flex items-center">
                            {typingUsers && typingUsers[user._id]?.isTyping && typingUsers[user._id]?.chatId === chat._id ? (
                              <span className="text-primary animate-pulse">typing...</span>
                            ) : (
                              onlineUsers.includes(user._id) ?
                                "Active now" :
                                getLastSeenText(user._id)
                            )}
                          </div>
                        </>
                      )}
                    </div>
 
                    <div className="hidden lg:block text-xs text-zinc-500 ml-auto">
                      {new Date(chat.updatedAt || chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.button>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
});
export default memo(Sidebar);