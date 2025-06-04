import { Check, X } from "lucide-react";

import { List } from "../../components/ui/List";
import { formatDistanceToNow } from "../../lib/util";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useApiQuery } from "../../hooks/useApiQuery";
import RequestsSkeleton from "./skeletons/RequestsSkeleton";

const ReceivedRequests = () => {

  const { data: requests, isLoading } = useApiQuery({
    keys: ["requests"],
    path: "/requests",
    errorMessage: "Failed to fetch requests data"
  })

  const { mutate: acceptRequest } = useApiMutation({
    method: "put",
    message: "Request accepted successfully",
    errorMessage: "Failed to accept request"
  })

  const { mutate: declineRequest } = useApiMutation({
    method: "put",
    message: "Request declined successfully",
    errorMessage: "Failed to decline request",
  })

  if (isLoading) <RequestsSkeleton />

  return (
    <div className="space-y-4">
      <List
        data={requests.received}
        getKey={(request) => request._id}
        getItem={(request) => {
          return (
            <div className="card bg-base-200 shadow-sm hover:shadow-md transition-all">
              <div className="card-body p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full border">
                      <img
                        src={request.sender?.profilePic || "/avatar.png"}
                        alt={request.sender?.username}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{request.sender?.username}</h3>
                    <p className="text-xs opacity-70">
                      {request.createdAt && formatDistanceToNow(request.createdAt)}
                    </p>
                  </div>

                  {request.status === "pending" ? (
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        className="btn btn-sm btn-success btn-circle tooltip tooltip-left"
                        data-tip="Accept"
                        onClick={() => acceptRequest({ data: { status: "accepted" }, path: `/requests/${request._id}`})}
                        disabled={requests === undefined}
                      >
                        {requests === undefined ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="btn btn-sm btn-error btn-circle tooltip tooltip-left"
                        data-tip="Decline"
                        onClick={() => declineRequest({ data: { status: "declined" }, path: `/requests/${request._id}`})}
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
                    <div className={`badge ${request.status === "accepted"
                      ? "badge-success"
                      : "badge-error"
                      }`}>
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
};

export default ReceivedRequests;
