
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { List, User } from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: List,
  },
];

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="w-16 md:w-56 h-screen flex flex-col bg-sidebar py-6 border-r border-sidebar-border/50 fixed left-0 top-0">
      <div className="px-3 mb-8 flex items-center justify-center md:justify-start">
        <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
          RTO
        </div>
        <span className="ml-3 text-xl font-semibold text-sidebar-foreground hidden md:inline-block">Tracker</span>
      </div>
      
      <nav className="space-y-1 px-2 flex-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "group relative overflow-hidden",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground"
              )}
            >
              <div className="flex items-center">
                <item.icon className={cn(
                  "h-5 w-5 mr-2",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                )} />
                <span className="hidden md:inline-block">{item.name}</span>
              </div>
              
              {isActive && (
                <div className="absolute inset-y-0 left-0 w-1 bg-sidebar-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-2 py-4 mt-auto">
        <Link
          to="/profile"
          className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
        >
          <User className="h-5 w-5 mr-2 text-sidebar-foreground/70" />
          <span className="hidden md:inline-block">Profile</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
