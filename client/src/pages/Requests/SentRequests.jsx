import { memo } from "react";
import { X } from "lucide-react";

import { List } from "../../components/ui/List";
import { formatDistanceToNow } from "../../lib/util";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useApiQuery } from "../../hooks/useApiQuery";
import RequestsSkeleton from "./skeletons/RequestsSkeleton";

const SentRequests = memo(() => {

  const { data: requests, isLoading } = useApiQuery({
    keys: ["requests"],
    path: "/requests",
    errorMessage: "Failed to fetch requests data"
  })

  const { mutate: cancelRequest } = useApiMutation({
    method: "delete",
    keys: ["requests"],
    message: "Request cancelled successfully",
    errorMessage: "Failed to cancel request",
  });

  const handleCancelRequest = id => {
    cancelRequest({ path: `/requests/${id}` });
  }

  if (isLoading) <RequestsSkeleton />

  return (
    <div className="space-y-4">
      <List
        data={requests.sent}
        getKey={(request) => request._id}
        getItem={(request) => {
          return (
            <div className="card bg-base-200 shadow-sm hover:shadow-md transition-all">
              <div className="card-body p-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full border">
                      <img
                        src={request.receiver?.profilePic || "/avatar.png"}
                        alt={request.receiver?.username}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{request.receiver?.username}</h3>
                    <p className="text-xs opacity-70">
                      {request.createdAt && formatDistanceToNow(request.createdAt)}
                    </p>
                  </div>

                  {request.status === "pending" ? (
                    <div className="mt-2 sm:mt-0">
                      <button
                        className="btn btn-sm btn-error btn-circle tooltip tooltip-left"
                        data-tip="Cancel Request"
                        onClick={() => handleCancelRequest(request._id)}
                        disabled={requests === undefined}
                      >
                        {requests === undefined ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className={`badge ${request.status === "accepted" ? "badge-success" : "badge-error"}`}>
                      {request.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
        }
      />
    </div>
  );
});

export default SentRequests;
