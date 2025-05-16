import { memo } from "react";
import { useRequestStore } from "../../store/useRequestStore";
import { List } from "../../components/ui/List";
import { Check, X } from "lucide-react";
import { formatDistanceToNow } from "../../lib/util";

const ReceivedRequests = memo(() => {
  const { requests, acceptRequest, declineRequest, isLoading } = useRequestStore();

  return (
    <div className="space-y-4">
      <List
        data={requests.received}
        getKey={(request) => request._id}
        getItem={(request) => (
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
                      onClick={() => acceptRequest(request._id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-error btn-circle tooltip tooltip-left"
                      data-tip="Decline"
                      onClick={() => declineRequest(request._id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className={`badge ${
                    request.status === "accepted"
                      ? "badge-success"
                      : "badge-error"
                  }`}>
                    {request.status}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
});

export default ReceivedRequests;
