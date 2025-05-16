import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import { useRequestStore } from "../store/useRequestStore";

const RequestsNavLink = memo(() => {
  const { 
    requests, 
    fetchRequests, 
    subscribeToRequestEvents, 
    unsubscribeFromRequestEvents 
  } = useRequestStore();

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();
    subscribeToRequestEvents();
    
    return () => {
      unsubscribeFromRequestEvents();
    };
  }, [fetchRequests, subscribeToRequestEvents, unsubscribeFromRequestEvents]);

  // Count pending received requests
  const pendingCount = requests.received.filter(req => req.status === "pending").length;

  return (
    <Link to="/requests" className="btn btn-sm gap-2">
      <div className="indicator">
        {pendingCount > 0 && (
          <span className="indicator-item badge badge-primary badge-xs">{pendingCount}</span>
        )}
        <MessageSquarePlus className="w-4 h-4" />
      </div>
      <span className="hidden sm:inline">Requests</span>
    </Link>
  );
});

export default RequestsNavLink;
