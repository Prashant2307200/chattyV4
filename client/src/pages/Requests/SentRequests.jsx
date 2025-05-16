import { memo } from "react";
import { useRequestStore } from "../../store/useRequestStore";
import { List } from "../../components/ui/List";
import { X } from "lucide-react";
import { formatDistanceToNow } from "../../lib/util";

const SentRequests = memo(() => {
  const { requests, cancelRequest, isLoading } = useRequestStore();

  return (
    <div className="space-y-4">
      <List
        data={requests.sent}
        getKey={(request) => request._id}
        getItem={(request) => (
          <div className="card bg-base-200 shadow-sm hover:shadow-md transition-all">
            <div className="card-body p-4">
              <div className="flex flex-wrap items-center gap-4">
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
                      onClick={() => cancelRequest(request._id)}
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
                  <div className={`badge ${request.status === "accepted" ? "badge-success":"badge-error"}`}>
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

export default SentRequests;
