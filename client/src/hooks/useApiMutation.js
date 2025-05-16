import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export function useApiMutation({keys=[], method='post', path='/', message=null, cb=()=>{}, onSuccess=null, onError=null}) {

  const queryClient = useQueryClient()

  // Ensure method is lowercase to match axios methods
  const normalizedMethod = method.toLowerCase();

  return useMutation({
    mutationFn: async data => {
      console.log(`Making ${normalizedMethod.toUpperCase()} request to ${path} with data:`, data);
      const response = await axiosInstance[normalizedMethod](path, data);
      console.log(`Response from ${path}:`, response.data);
      return response.data;
    },
    onSuccess: data => {
      // Call the callback function
      cb(data);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: keys, exact: true });

      // Show success message if provided
      message && toast.success(message);

      // Call custom onSuccess handler if provided
      if (onSuccess) onSuccess(data);
    },
    onError: error => {
      console.error(`Error in ${normalizedMethod.toUpperCase()} request to ${path}:`, error);

      // Show error toast
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong!");

      // Call custom onError handler if provided
      if (onError) onError(error);
    }
  })
}