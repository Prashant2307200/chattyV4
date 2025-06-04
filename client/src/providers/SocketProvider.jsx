import { useEffect } from "react";

import { useApiQuery } from "../hooks/useApiQuery";
import PageLoader from "../components/ui/PageLoader";

import { useSocketStore } from "../store/useSocketStore";
import { useQueryClient } from "@tanstack/react-query";

export const SocketProvider = ({ children }) => {

  const { data, isLoading } = useApiQuery({
    keys: ["auth"],
    path: "/auth/check",
    errorMessage: "Failed to fetch authentication status"
  });

  const queryClient = useQueryClient();
  const { subscribeToEvents, unsubscribeFromEvents } = useSocketStore();

  useEffect(() => {
    if (!data?._id) return;
    subscribeToEvents(data._id, queryClient);
    return () => unsubscribeFromEvents();
  }, [subscribeToEvents, unsubscribeFromEvents, data?._id]);

  if (isLoading)
    return <PageLoader />;

  return children;
}