import { memo } from "react";
import { Link } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import { useApiQuery } from "../hooks/useApiQuery";

const RequestsNavLink = memo(() => {
  
  const { data: requests } = useApiQuery({
    keys: ['requests'],
    path: "/requests",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  const pendingCount = requests?.received.filter(req => req.status === "pending").length;

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
