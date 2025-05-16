import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users } from "lucide-react";
import CreateGroupChat from "./CreateGroupChat";

const CreateGroupChatButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.button
        className="btn btn-sm btn-primary gap-2"
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">New Group</span>
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <CreateGroupChat onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateGroupChatButton;
