import { useEffect } from "react";

import { useApiQuery } from "../hooks/useApiQuery";
import PageLoader from "../components/ui/PageLoader";

import { useSocketStore } from "../store/useSocketStore";

export const SocketProvider = ({ children }) => {

  const { data, isLoading } = useApiQuery({
    keys: ["auth"],
    path: "/auth/check",
    errorMessage: "Failed to fetch authentication status",
  });

  const { subscribeToEvents, unsubscribeFromEvents } = useSocketStore();

  useEffect(() => {
    subscribeToEvents(data._id);
    return () => unsubscribeFromEvents();
  }, [subscribeToEvents, unsubscribeFromEvents, data]);

  if (isLoading) 
    return <PageLoader />;

  return children;
}