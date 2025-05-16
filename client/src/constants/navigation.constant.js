import { LogOut, Settings, User, Bot } from "lucide-react";
import Logo from "../components/ui/AppLogo";

export const navigation = {
  logo: Logo,
  title: "Chatty",
  links: [
    { title: "Settings", href: "/settings", icon: Settings },
    { title: "Profile", href: "/profile", icon: User },
    { title: "Logout", icon: LogOut }
  ]
}

// AI Chat navigation (used for direct links but not in navbar)
export const aiChatNavigation = {
  title: "AI Chat",
  href: "/ai-chat",
  icon: Bot
}