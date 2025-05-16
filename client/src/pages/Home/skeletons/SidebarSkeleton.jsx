import React, { memo } from "react";
import { Users } from "lucide-react";

const SidebarSkeleton = memo(() => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <div className="h-full overflow-hidden">
    <aside className="h-full w-full flex flex-col transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="flex-1 overflow-y-auto w-full py-3 pb-0">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
    </div>
  );
});

export default SidebarSkeleton;