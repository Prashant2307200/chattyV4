import { useState } from 'react'; 

import { useApiQuery } from './useApiQuery';
import { useDebounce } from './useDebounce';

export function useUserSearch(debounceDelay = 500) { 

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
 
  const queryParams = debouncedSearchTerm
    ? `?search=${debouncedSearchTerm}`
    : '';

  const { 
    data: users, 
    isLoading
  } = useApiQuery({
    keys: ['users', debouncedSearchTerm],
    path: `/users${queryParams}`,
    enabled: true
  }); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    users,
    isLoading,
    handleSearchChange,
    clearSearch,
  };
}
