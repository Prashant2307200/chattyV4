import { toFormData } from "axios";
import toast from "react-hot-toast";
import { Image, Send, X } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDebouncedCallback, useThrottledCallback } from "../../hooks/useDebouncedCallback";

import { useSocketStore } from "../../store/useSocketStore";
import { useApiMutation } from "../../hooks/useApiMutation";

const MessageInput = () => {

  const { hasAuthUser, socket, selectedChat } = useSocketStore(); 

  const { mutate: sendMessage, isPending: isMessagesLoading } = useApiMutation({
    keys: ["chats", `${selectedChat?._id}`, "messages"],
    path: `/chats/${selectedChat?._id}/messages`
  })

  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const emitTyping = useThrottledCallback(() => {
    if (!socket || !selectedChat || !text.trim()) return;

    socket.emit("typing", { chatId: selectedChat._id });
    setIsTyping(true);
  }, 1000, [socket, selectedChat]);
 
  const emitStopTyping = useDebouncedCallback(() => {
    if (!socket || !selectedChat || !isTyping) return;

    socket.emit("stopTyping", { chatId: selectedChat._id });
    setIsTyping(false);
  }, 2000, [socket, selectedChat, isTyping]);

  // Handle text changes
  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);

    if (newText.trim()) {
      emitTyping();
      // Reset the stop typing timer
      emitStopTyping();
    } else if (isTyping) { 
      socket?.emit("stopTyping", { chatId: selectedChat?._id });
      setIsTyping(false);
    }
  }, [socket, selectedChat, isTyping, emitTyping, emitStopTyping]);
 
  useEffect(() => {
    return () => {
      if (socket && selectedChat && isTyping) {
        socket.emit("stopTyping", { chatId: selectedChat._id });
      }
    };
  }, [socket, selectedChat, isTyping]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = e => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) {
      toast.error("Please enter a message or select an image.");
      return;
    }

    if (isTyping && socket && selectedChat) {
      socket.emit("stopTyping", { chatId: selectedChat._id });
      setIsTyping(false);
    }

    const newMessage = {
      sender: hasAuthUser,
      chat: selectedChat._id,
      text: text.trim(),
      image: fileInputRef.current?.files?.[0] || imagePreview,
    }
    const formData = toFormData(newMessage);
    sendMessage(formData);

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <div className="p-4 w-full border-t border-base-300 h-auto">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img className="w-20 h-20 object-cover rounded-lg border border-base-300 shadow-2xl"
              src={imagePreview}
              alt="Preview"
            />
            <button className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              onClick={removeImage}
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={handleTextChange}
          />
          <input className="hidden"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-base-content/50"}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button className="btn btn-sm btn-circle bg-primary"
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isMessagesLoading}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
