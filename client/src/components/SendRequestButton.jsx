import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { memo, useState } from "react";
import { MessageSquarePlus, UserCheck, Clock, Send } from "lucide-react";

import { useRequestStore } from "../store/useRequestStore";

const SendRequestButton = memo(({ userId, username, disabled = false }) => {

  const [isLoading, setIsLoading] = useState(false);
  const { sendRequest, requests } = useRequestStore();  

  const hasSentRequest = requests.sent.some((req) => req.receiver._id === userId && req.status === "pending" );
  const hasPendingRequest = requests.received.some((req) => req.sender._id === userId && req.status === "pending");

  const hasAcceptedRequest = ((requests.received.some(
    (req) => req.sender._id === userId && req.status === "accepted"
  )) || (requests.sent.some(
    (req) => req.receiver._id === userId && req.status === "accepted"
  )));

  const handleSendRequest = async () => {

    if (hasPendingRequest) {
      toast.error(`You already have a pending request from ${username}`);
      return;
    }

    if (hasSentRequest) {
      toast.error(`You already sent a request to ${username}`);
      return;
    }

    if (hasAcceptedRequest) {
      toast.error(`You are already connected with ${username}`);
      return;
    }

    setIsLoading(true);
    try {
      await sendRequest(userId);
    } finally {
      setIsLoading(false);
    }
  }; 

  if (hasAcceptedRequest) {
    return (
      <motion.button
        className="btn btn-sm btn-outline border-0 btn-success w-full sm:w-auto"
        // disabled={true}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="md:inline hidden"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: 0 }}
        >
          <UserCheck className="w-4 h-4" />
        </motion.div>
        <span className="md:hidden inline">Friend</span>
      </motion.button>
    );
  }

  if (hasPendingRequest) {
    return (
      <motion.button
        className="btn btn-sm btn-outline border-0 w-full sm:w-auto"
        disabled={false}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="md:inline hidden"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, repeat: 0 }}
        >
          <Clock className="w-4 h-4" />
        </motion.div>
        <span className="md:hidden inline">Pending request</span>
      </motion.button>
    );
  }

  if (hasSentRequest) {
    return (
      <motion.button
        className="btn btn-sm btn-outline border-0 w-full sm:w-auto"
        disabled={false}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="md:inline hidden"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, repeat: 0 }}
        >
          <Send className="w-4 h-4" />
        </motion.div>
        <span className="md:hidden inline">Request Sent</span>
      </motion.button>
    );
  }


  return (
    <motion.button
      className="btn btn-sm btn-primary w-full sm:w-auto"
      onClick={handleSendRequest}
      disabled={isLoading || disabled}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ duration: 0.2 }}
        >
          <MessageSquarePlus className="w-4 h-4" />
        </motion.div>
      )}
      <span className="inline md:hidden">Send Request</span>
    </motion.button>
  );
});

export default SendRequestButton;
