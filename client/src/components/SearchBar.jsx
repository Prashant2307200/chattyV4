import { memo } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

const SearchBar = memo(({
  searchTerm,
  handleSearchChange,
  clearSearch,
  placeholder = 'Search...',
  className = ''
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="w-4 h-4 text-base-content/50" />
          </motion.div>
        </div>
        <input
          type="text"
          className="input input-bordered w-full pl-10 pr-10 py-2 text-sm"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <motion.button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={clearSearch}
            aria-label="Clear search"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-4 h-4 text-base-content/50 hover:text-base-content" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});

export default SearchBar;
