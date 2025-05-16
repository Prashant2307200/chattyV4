import { MessageSquarePlus } from "lucide-react";
import { styles } from "../../../constants/style.constant";

const RequestsSkeleton = () => {
  // Create skeleton items
  const skeletonItems = Array(3).fill(null);

  return (
    <main className="h-screen bg-base-200">
      <section className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex flex-col h-full rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-base-300 p-5">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-6 h-6 text-primary" />
                <h1 className={styles.title}>Chat Requests</h1>
              </div>
              <p className={styles.subtitle}>
                Manage your chat requests and connections
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Received Requests */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Received Requests</h2>
                  <div className="space-y-4">
                    {skeletonItems.map((_, index) => (
                      <div key={`received-${index}`} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          <div className="flex items-center gap-4">
                            <div className="skeleton w-12 h-12 rounded-full"></div>
                            <div className="flex-1">
                              <div className="skeleton h-4 w-24 mb-2"></div>
                              <div className="skeleton h-3 w-16"></div>
                            </div>
                            <div className="flex gap-2">
                              <div className="skeleton w-8 h-8 rounded-full"></div>
                              <div className="skeleton w-8 h-8 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sent Requests */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Sent Requests</h2>
                  <div className="space-y-4">
                    {skeletonItems.map((_, index) => (
                      <div key={`sent-${index}`} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          <div className="flex items-center gap-4">
                            <div className="skeleton w-12 h-12 rounded-full"></div>
                            <div className="flex-1">
                              <div className="skeleton h-4 w-24 mb-2"></div>
                              <div className="skeleton h-3 w-16"></div>
                            </div>
                            <div className="skeleton w-8 h-8 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RequestsSkeleton;
