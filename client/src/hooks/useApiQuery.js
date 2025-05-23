import { useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useApiQuery({ keys=[], path='/', message, ...props }) {
  
  const {
    data,
    isError,
    isLoading,
    error, 
  } = useQuery({
    queryKey: keys,
    queryFn: async () => (await axiosInstance.get(path)).data, 
    ...props
  }); 

  useEffect(() => {
    if (isError) 
      toast.error(error.response?.data?.message || message || error?.message || "Something went wrong!");
  }, [isError, error]);

  return { isLoading, data };
}