import { useState } from "react";
import { motion } from "motion/react";
import { Users, X, Check, UserPlus } from "lucide-react";
import { useApiMutation } from "../hooks/useApiMutation";
import { useApiQuery } from "../hooks/useApiQuery";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreateGroupChat = ({ onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const queryClient = useQueryClient();

  // Fetch all users the current user has chats with
  const { data: chatUsers, isLoading } = useApiQuery({
    keys: ["chatUsers"],
    path: "/chats"
  });

  // Extract unique users from all chats
  const uniqueUsers = chatUsers ? [...new Map(
    chatUsers.flatMap(chat =>
      chat.participants.map(user => [user._id, user])
    )
  ).values()] : [];

  // Create group chat mutation
  const { mutate: createGroupChat, isLoading: isCreating } = useApiMutation({
    keys: ["chats"], // Use the same key as the chat list query
    path: "/chats/group",
    method: "POST",
    message: "Group chat created successfully!",
    onSuccess: () => {
      // Force refetch the chats list
      queryClient.invalidateQueries(["chats"]);
      queryClient.refetchQueries(["chats"]);
      onClose();
    },
    onError: (error) => {
      console.error("Error creating group chat:", error);
      toast.error(error?.response?.data?.message || "Failed to create group chat");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedUsers.length < 2) {
      toast.error("Please select at least 2 users for a group chat");
      return;
    }

    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    // Log the data being sent
    const groupChatData = {
      name: groupName,
      participants: selectedUsers.map(user => user._id)
    };
    console.log("Creating group chat with data:", groupChatData);

    // Use the mutation function
    createGroupChat(groupChatData);
  };

  const toggleUserSelection = (user) => {
    if (selectedUsers.some(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-base-100 rounded-lg shadow-xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create Group Chat
          </h2>
          <button
            className="btn btn-sm btn-ghost btn-circle"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Group Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter group name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Select Users (min 2)</span>
            </label>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedUsers.map(user => (
                  <div
                    key={user._id}
                    className="badge badge-primary gap-1"
                  >
                    {user.username}
                    <button
                      type="button"
                      onClick={() => toggleUserSelection(user)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-base-200 rounded-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : uniqueUsers.length === 0 ? (
                <div className="p-4 text-center text-base-content/70">
                  No users found. Start chatting with someone first!
                </div>
              ) : (
                uniqueUsers.map(user => (
                  <motion.div
                    key={user._id}
                    className={`flex items-center gap-3 p-3 hover:bg-base-300 cursor-pointer ${
                      selectedUsers.some(u => u._id === user._id) ? "bg-base-300" : ""
                    }`}
                    onClick={() => toggleUserSelection(user)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={user.profilePic || "/avatar.png"} alt={user.username} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{user.username}</div>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedUsers.some(u => u._id === user._id) ? (
                        <div className="bg-primary text-primary-content rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="bg-base-300 rounded-full p-1">
                          <UserPlus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={selectedUsers.length < 2 || !groupName.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateGroupChat;
