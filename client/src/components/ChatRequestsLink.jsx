import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import { useRequestStore } from "../store/useRequestStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react"; 

const ChatRequestsLink = memo(() => {
  const {
    requests,
    fetchRequests,
    subscribeToRequestEvents,
    unsubscribeFromRequestEvents
  } = useRequestStore();

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();
    subscribeToRequestEvents();

    return () => {
      unsubscribeFromRequestEvents();
    };
  }, [fetchRequests, subscribeToRequestEvents, unsubscribeFromRequestEvents]);

  // Count pending received requests
  const pendingCount = requests.received.filter(req => req.status === "pending").length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to="/requests" className="btn btn-sm gap-2">
        <div className="indicator">
          <AnimatePresence>
            {pendingCount > 0 && (
              <motion.span
                className="indicator-item badge badge-primary badge-xs"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                {pendingCount}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ rotate: 0 }}
            animate={pendingCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: pendingCount > 0 ? 1 : 0 }}
          >
            <MessageSquarePlus className="w-4 h-4" />
          </motion.div>
        </div>
        <span className="hidden sm:inline">Requests</span>
      </Link>
    </motion.div>
  );
});

export default ChatRequestsLink;
