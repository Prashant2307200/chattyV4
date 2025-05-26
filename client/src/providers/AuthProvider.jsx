import { useEffect } from "react";

import { useApiQuery } from "../hooks/useApiQuery";
import PageLoader from "../components/ui/PageLoader";
import { useSocketStore } from "../store/useSocketStore";

export const AuthProvider = ({ children }) => {

  const { subscribeToEvents, unsubscribeFromEvents } = useSocketStore();
  const { data, isLoading: isCheckingAuth } = useApiQuery({ keys: ["authUser"], path: '/auth/check' });

  useEffect(() => {
    
    if (!navigator.onLine || !data?._id) return;

    subscribeToEvents(data._id);
    return () => unsubscribeFromEvents();
  }, [navigator.onLine, subscribeToEvents, unsubscribeFromEvents, data?._id]);

  if (isCheckingAuth) 
    return <PageLoader />

  return children;
}