import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion"; 
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const RequestsPage = lazy(() => import("./pages/Requests/RequestsPage"));
const AiChatPage = lazy(() => import("./pages/AiChat/AiChatPage"));

import Navbar from "./components/ui/Navbar";
import PageLoader from "./components/ui/PageLoader";
 
import { useThemeStore } from "./store/useThemeStore";
import { useSocketStore } from "./store/useSocketStore"; 

const App = () => { 

  const { theme } = useThemeStore();  
  const { hasAuthUser } = useSocketStore();

  const location = useLocation();

  return (
    <div className="flex flex-col h-[100svh]" data-theme={theme}>
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={hasAuthUser ? <PageWrapper><HomePage /></PageWrapper> : <Navigate to="/auth" />} />
              <Route path="/auth" element={!hasAuthUser ? <PageWrapper><AuthPage /></PageWrapper> : <Navigate to="/" />} />
              <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
              <Route path="/profile" element={hasAuthUser ? <PageWrapper><ProfilePage /></PageWrapper> : <Navigate to="/auth" />} />
              <Route path="/requests" element={hasAuthUser ? <PageWrapper><RequestsPage /></PageWrapper> : <Navigate to="/auth" />} />
              <Route path="/ai-chat" element={hasAuthUser ? <PageWrapper><AiChatPage /></PageWrapper> : <Navigate to="/auth" />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;
