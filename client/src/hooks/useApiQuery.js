import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../lib/axios";

export function useApiQuery({ keys = [], path = "/", message, ...props }) {
  
  const isOffline = !navigator.onLine;

  const {
    data,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: keys,
    queryFn: async () => {
      if (isOffline) {
        const cache = await caches.open("api-cache");
        const res = await cache.match(`/api/v1${path}`);
        if (res && res.ok) return await res.json();
        throw new Error("No cached data found");
      } else return (await axiosInstance.get(path)).data;
    },
    retry: isOffline ? false : 1,
    ...props,
  });

  useEffect(() => {
    if (isError)
      toast.error(error?.response?.data?.message || message || error?.message || "Something went wrong!");
  }, [isError, error]);

  return { isLoading, data };
}
