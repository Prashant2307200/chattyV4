import { memo } from "react";
import { Users, UserPlus } from "lucide-react";

import { List } from "../../components/ui/List";
import SearchBar from "../../components/SearchBar";
import { formatNumber } from "../../utils/formatUtils";
import { styles } from "../../constants/style.constant";
import { useUserSearch } from "../../hooks/useUserSearch";
import SendRequestButton from "../../components/SendRequestButton";

import { motion, AnimatePresence } from "motion/react";

const UsersList = memo(() => {

  const {
    searchTerm,
    users,
    error,
    handleSearchChange,
    clearSearch
  } = useUserSearch(500);  

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <motion.p
          className="text-error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Failed to load users
        </motion.p>
      </div>
    );
  }

  // Render loading state
  if (users === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="loading loading-spinner loading-lg"></span>
        </motion.div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-error">Failed to load users</p>
      </div>
    );
  }

  // Render empty state with search bar
  if (!users || users.length === 0) {
    return (
      <div className="p-4 w-full">
        <motion.div
          className="flex flex-col space-y-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xs sm:text-xl md:text-xs">Find Users to Chat With</h2>
            <div className="flex items-center gap-2">
              <UserPlus size={16} className="text-primary" />
              <span className="badge badge-primary">0 friends</span>
            </div>
          </div>
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            clearSearch={clearSearch}
            placeholder="Search by username or email..."
            className="w-full max-w-md"
          />
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-4"
          >
            <Users className="w-12 h-12 text-primary/50" />
          </motion.div>
          <motion.h3
            className="text-lg font-semibold"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {searchTerm ? 'No Users Match Your Search' : 'No Users Found'}
          </motion.h3>
          <motion.p
            className={styles.subtitle}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {searchTerm
              ? `No users matching "${searchTerm}" were found. Try a different search term.`
              : 'There are no other users to chat with at the moment.'}
          </motion.p>
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                className="btn btn-sm btn-outline mt-4"
                onClick={clearSearch}
                initial={{ y: 10, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.5, duration: 0.2 }}
              >
                Clear Search
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <motion.div
        className="flex flex-col space-y-4 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-xl md:text-xs font-semibold">Find Users to Chat With</h2>
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-primary" />
            <span className="badge badge-primary">{formatNumber(users?.length || 0, true)}</span>
          </div>
        </div>
        <SearchBar
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          clearSearch={clearSearch}
          placeholder="Search by username or email..."
          className="w-full max-w-md"
        />
        <AnimatePresence>
          {searchTerm && users && users.length > 0 && (
            <motion.div
              className="text-sm text-base-content/70"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              Found {formatNumber(users.length, true)} matching "{searchTerm}"
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <List
          data={users}
          getKey={(user) => user._id}
          getItem={(user, index) => (
            <motion.div
              className="card bg-base-200 w-full hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              layout
            >
              <div className="card-body p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full border">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.username}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0"> {/* min-width prevents flex item from overflowing */}
                    <h3 className="font-medium truncate">{user.username}</h3>
                    <p className="text-xs opacity-70 truncate">{user.email}</p>
                  </div>
                  <div className="flex-shrink-0 mt-2 sm:mt-0"> {/* Ensures button doesn't shrink */}
                    <SendRequestButton
                      userId={user._id}
                      username={user.username}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        />
      </motion.div>
    </div>
  );
});

export default UsersList;
