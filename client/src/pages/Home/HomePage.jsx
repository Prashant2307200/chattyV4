import { useMemo, useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import UsersList from "./UsersList";
import ChatContainer from "./ChatContainer";
import NoChatSelected from "./NoChatSelected";
import { Tabs, Tab } from "../../components/ui/Tabs";
import { useSocketStore } from "../../store/useSocketStore";
import ChatHeader from "./ChatHeader";

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

      {/* chat layout */}
      <section className="flex items-center justify-center pt-15 sm:px-4 sm:pt-20">

        {/* chat container */}
        <div className="bg-base-100 sm:rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)] shadow">

          {/* Mobile View - Stack sidebar and chat vertically */}
          <div className="md:hidden flex flex-col-reverse sm:flex-col h-full sm:rounded-lg overflow-hidden">
            {/* Only show tabs when not viewing a chat */}
            {!showChatOnMobile && (
              <Tabs activeTab={activeTab} onChange={setActiveTab}>
                <Tab id="chats" label="Chats" />
                <Tab id="users" label="Users" />
              </Tabs>
            )}

            {/* Show either the chat container or the sidebar/users list */}
            <div className="flex-1 overflow-auto">
              {showChatOnMobile ? (
                // Pass our custom back handler to the chat container
                <ChatContainer><ChatHeader onMobileBack={handleMobileBack} /></ChatContainer>
              ) : (
                // Show sidebar or users list based on active tab
                activeTab === "chats" ? (
                  <Sidebar onChatSelect={() => setShowChatOnMobile(true)} />
                ) : (
                  memoizedUsersList
                )
              )}
            </div>
          </div>


          {/* Desktop View - Side by side layout */}
          <div className="hidden md:flex h-full rounded-lg overflow-hidden">
            <div className="flex flex-col h-full border-r border-base-300 w-72">
              <Tabs activeTab={activeTab} onChange={setActiveTab}>
                <Tab id="chats" label="Chats" />
                <Tab id="users" label="Users" />
              </Tabs>
              <div className="flex-1 overflow-auto">
                {activeTab === "chats" ? <Sidebar /> : memoizedUsersList}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {!selectedChat ? memoizedNoChatSelected : <ChatContainer><ChatHeader /></ChatContainer>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
