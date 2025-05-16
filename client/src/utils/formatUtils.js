/**
 * Formats a number to a more readable format with K, M, B suffixes
 * @param {number} num - The number to format
 * @param {boolean} showFriendText - Whether to append "friend" or "friends" text
 * @returns {string} - The formatted number
 */
export function formatNumber(num, showFriendText = false) {
  if (num === undefined || num === null) return showFriendText ? '0 friends' : '0';
  
  // Handle singular case
  if (num === 1 && showFriendText) {
    return '1 friend';
  }
  
  let formattedNum;
  
  if (num < 1000) {
    formattedNum = num.toString();
  } else if (num < 1000000) {
    formattedNum = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
  } else if (num < 1000000000) {
    formattedNum = (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
  } else {
    formattedNum = (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 1) + 'B';
  }
  
  // Remove .0 if present
  formattedNum = formattedNum.replace('.0', '');
  
  if (showFriendText) {
    return `${formattedNum} friends`;
  }
  
  return formattedNum;
}

/**
 * Formats a date to a relative time string (e.g., "2 minutes ago")
 * @param {Date|string} date - The date to format
 * @returns {string} - The formatted relative time
 */
export function formatRelativeTime(date) {
  if (!date) return 'Never';
  
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}
