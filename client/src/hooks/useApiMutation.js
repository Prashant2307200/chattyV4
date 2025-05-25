import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "../lib/axios";

export function useApiMutation({
  keys = [],
  method = 'post',
  path = '/',
  message = null,
  errorMessage,
  cb = () => {},
  onSuccess = null,
  onError = null
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async data => {
      if (!navigator.onLine) 
        toast.success("You're offline. Your action will be completed once you're back online.");
      const response = await axiosInstance[method](path, data);
      return response.data;
    },
    onSuccess: data => {
      cb(data);
      queryClient.invalidateQueries({ queryKey: keys });
      if (message) toast.success(message);
      if (onSuccess) onSuccess(data);
    },
    onError: error => {
      if (navigator.onLine) 
        toast.error(error?.response?.data?.message || errorMessage || error?.message || "Something went wrong!");
      if (onError) onError(error);
    }
  });
}
