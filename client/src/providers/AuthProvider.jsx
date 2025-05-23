import { useEffect } from "react";

import { useApiQuery } from "../hooks/useApiQuery";
import PageLoader from "../components/ui/PageLoader";
import { useSocketStore } from "../store/useSocketStore";

export const AuthProvider = ({ children }) => {

  const { subscribeToEvents, unsubscribeFromEvents } = useSocketStore();
  const { data, isLoading: isCheckingAuth } = useApiQuery({ keys: ["authUser"], path: '/auth/check' });

  useEffect(() => {
    subscribeToEvents(data?._id);
    return () => unsubscribeFromEvents();
  }, [subscribeToEvents, unsubscribeFromEvents, data?._id]);

  if (isCheckingAuth) 
    return <PageLoader />

  return children;
}