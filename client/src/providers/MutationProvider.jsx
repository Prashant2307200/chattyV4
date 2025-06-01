import { cloneElement } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "../lib/axios";

export function MutationProvider({ children, path, keys = [], method = 'post', message = null, errorMessage, cb = () => {}, props = {}}) {

  const queryClient = useQueryClient();

  const mutation = useMutation({
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
    },
    onError: error => {
      if (navigator.onLine)
        toast.error(error?.response?.data?.message || errorMessage || error?.message || "Something went wrong!");
    },
    ...props
  });

  return cloneElement(children, { mutation });
}