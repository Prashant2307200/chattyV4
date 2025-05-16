import { useEffect, useRef, useCallback } from 'react';

/**
 * A custom hook that creates a debounced version of a function.
 * 
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Array} dependencies - Dependencies that should trigger a reset of the debounce timer
 * @returns {Function} - The debounced function
 */
export function useDebouncedCallback(callback, delay, dependencies = []) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear the timeout when dependencies change or component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...dependencies]);

  // The debounced function
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

/**
 * A custom hook that creates a throttled version of a function.
 * 
 * @param {Function} callback - The function to throttle
 * @param {number} delay - The delay in milliseconds
 * @param {Array} dependencies - Dependencies that should trigger a reset of the throttle timer
 * @returns {Function} - The throttled function
 */
export function useThrottledCallback(callback, delay, dependencies = []) {
  const timeoutRef = useRef(null);
  const lastCalledRef = useRef(0);
  const callbackRef = useRef(callback);

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear the timeout when dependencies change or component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...dependencies]);

  // The throttled function
  return useCallback((...args) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCalledRef.current;

    if (timeSinceLastCall >= delay) {
      // If enough time has passed, call the function immediately
      lastCalledRef.current = now;
      callbackRef.current(...args);
    } else {
      // Otherwise, schedule it to be called after the remaining time
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastCalledRef.current = Date.now();
        callbackRef.current(...args);
      }, delay - timeSinceLastCall);
    }
  }, [delay]);
}
