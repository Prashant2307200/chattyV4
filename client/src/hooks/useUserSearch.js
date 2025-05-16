import { useState, useEffect } from 'react';
import { useApiQuery } from './useApiQuery';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for searching users with debounce
 * @param {number} debounceDelay - Delay in milliseconds for debouncing
 * @returns {Object} - Search state and functions
 */
export function useUserSearch(debounceDelay = 500) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
  
  // Build the query parameters
  const queryParams = debouncedSearchTerm 
    ? `?search=${encodeURIComponent(debouncedSearchTerm)}` 
    : '';
  
  // Fetch users with the search query
  const { 
    data: users, 
    isLoading, 
    error, 
    refetch 
  } = useApiQuery({
    keys: ['users', debouncedSearchTerm],
    path: `/users${queryParams}`,
    enabled: true
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  return {
    searchTerm,
    users,
    isLoading,
    error,
    handleSearchChange,
    clearSearch,
    refetch
  };
}
