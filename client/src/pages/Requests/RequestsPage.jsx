import { MessageSquarePlus } from "lucide-react";

import NoRequests from "./NoRequests";
import SentRequests from "./SentRequests";
import ReceivedRequests from "./ReceivedRequests";
import { styles } from "../../constants/style.constant";
import RequestsSkeleton from "./skeletons/RequestsSkeleton";
import { useApiQuery } from "../../hooks/useApiQuery";

const RequestsPage = () => {

  const { data: requests, isLoading } = useApiQuery({
    keys: ["requests"],
    path: "/requests",
    errorMessage: "Failed to load requests"
  });

  const hasRequests = requests?.received.length > 0 || requests?.sent.length > 0;

  if (isLoading)
    return <RequestsSkeleton />;

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
              {!hasRequests ? (
                <NoRequests />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Received Requests */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Received Requests</h2>
                    {requests?.received?.length === 0 ? (
                      <p className={styles.subtitle}>No received requests</p>
                    ) : (
                      <ReceivedRequests />
                    )}
                  </div>

                  {/* Sent Requests */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Sent Requests</h2>
                    {requests?.sent?.length === 0 ? (
                      <p className={styles.subtitle}>No sent requests</p>
                    ) : (
                      <SentRequests />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RequestsPage;
