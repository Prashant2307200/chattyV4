import { Link } from "react-router-dom";

import ChatRequestsLink from "../ChatRequestsLink";
import { navigation } from "../../constants/navigation.constant";

import { useSocketStore } from "../../store/useSocketStore";
import { MutationProvider } from "../../providers/MutationProvider";
import { QueryProvider } from "../../providers/QueryProvider";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {

  const Logo = navigation.logo;
  const Settings = navigation.links[0].icon;

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Logo className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">{navigation.title}</h1>
            </Link>
          </div>

          {/* navigation */}
          <nav className="flex items-center gap-2">
            <Link className={`btn btn-sm gap-2 transition-colors`} to={navigation.links[0].href}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{navigation.links[0].title}</span>
            </Link>
            <AuthNavigation />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const AuthNavigation = () => {

  const { hasAuthUser } = useSocketStore();
  const User = navigation.links[1].icon

  return hasAuthUser && (
    <>
      <QueryProvider path='/requests' keys={['requests']} errorMessage="Failed to fetch requests.">
        <ChatRequestsLink />
      </QueryProvider>
      <Link to={navigation.links[1].href} className={`btn btn-sm gap-2`}>
        <User className="size-5" />
        <span className="hidden sm:inline">{navigation.links[1].title}</span>
      </Link>
      <MutationProvider
        keys={["auth"]}
        method="delete"
        path="/auth/logout"
        message="Logged out Successfully!"
        cb={() => useSocketStore.getState().unsubscribeFromEvents()}
      >
        <Logout />
      </MutationProvider>
    </>
  )
}

const Logout = ({ mutation: LogoutMutation }) => {

  const LogOut = navigation.links[2].icon;
  const queryClient = useQueryClient();

  const handleOnLogout = () => {
    queryClient.clear();
    LogoutMutation.mutate();
  }

  return (
    <button className="btn btn-sm gap-2" onClick={handleOnLogout} disabled={LogoutMutation.isPending}>
      <LogOut className="size-4" />
      <span className="hidden sm:inline">{navigation.links[2].title}</span>
    </button>
  )
}