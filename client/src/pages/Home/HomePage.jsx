import { useMemo, useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import UsersList from "./UsersList";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import ChatContainer from "./ChatContainer";
import NoChatSelected from "./NoChatSelected";
import { Tabs, Tab } from "../../components/ui/Tabs";

import { useSocketStore } from "../../store/useSocketStore";
import { QueryProvider } from "../../providers/QueryProvider";
import { MutationProvider } from "../../providers/MutationProvider";

const RenderChatView = ({ selectedChatId }) => {
  
  if (!selectedChatId) return null;

  return (
    <QueryProvider keys={["chats", `${selectedChatId}`]} path={`/chats/${selectedChatId}`} enabled={false}>
      <ChatContainer>
        <ChatHeader />
        <MutationProvider
          path={`/chats/${selectedChatId}/messages`}
          keys={["chats", `${selectedChatId}`, "messages"]}
        >
          <MessageInput />
        </MutationProvider>
      </ChatContainer>
    </QueryProvider>
  );
};


const HomePage = () => {

  const { selectedChat } = useSocketStore();
  const [activeTab, setActiveTab] = useState("chats");

  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  useEffect(() => {
    if (selectedChat)
      setShowChatOnMobile(true);
    else
      setShowChatOnMobile(false);
  }, [selectedChat]);

  const handleMobileBack = () => {
    setShowChatOnMobile(false);
  };

  const memoizedNoChatSelected = useMemo(() => <NoChatSelected />, []);
  const memoizedUsersList = useMemo(() => <UsersList />, []);

  return (
    <main className="h-[100svh] bg-base-200">

      <section className="flex items-center justify-center pt-15 sm:px-4 sm:pt-20">

        <div className="bg-base-100 sm:rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)] shadow">

          <div className="md:hidden flex flex-col-reverse sm:flex-col h-full sm:rounded-lg overflow-hidden">

            {!showChatOnMobile && (
              <Tabs activeTab={activeTab} onChange={setActiveTab}>
                <Tab id="chats" label="Chats" />
                <Tab id="users" label="Users" />
              </Tabs>
            )}

            <div className="flex-1 overflow-auto">
              {showChatOnMobile && selectedChat?._id ? <RenderChatView selectedChatId={selectedChat._id} /> : (
                activeTab === "chats" ? (
                  <QueryProvider keys={["chats"]} path="/chats" >
                    <Sidebar onChatSelect={() => setShowChatOnMobile(true)} />
                  </QueryProvider>
                ) : memoizedUsersList
              )}
            </div>
          </div>

          <div className="hidden md:flex h-full rounded-lg overflow-hidden">
            <div className="flex flex-col h-full border-r border-base-300 w-72">
              <Tabs activeTab={activeTab} onChange={setActiveTab}>
                <Tab id="chats" label="Chats" />
                <Tab id="users" label="Users" />
              </Tabs>
              <div className="flex-1 overflow-auto">
                {activeTab === "chats" ? (
                  <QueryProvider keys={["chats"]} path="/chats">
                    <Sidebar />
                  </QueryProvider>
                ) : (
                  memoizedUsersList
                )}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {!selectedChat || !selectedChat?._id ? (
                memoizedNoChatSelected
              ) : <RenderChatView selectedChatId={selectedChat._id} />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;