import { memo } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

const NoRequests = memo(() => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16">
      <div className="max-w-md text-center space-y-6">
        
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <MessageSquarePlus className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Info Text */}
        <h2 className="text-2xl font-bold">No Chat Requests</h2>
        <p className="text-base-content/60">
          You don't have any chat requests at the moment.
        </p>
        <Link to="/" className="btn btn-primary">
          Find Users to Chat
        </Link>
      </div>
    </div>
  );
});

export default NoRequests;
