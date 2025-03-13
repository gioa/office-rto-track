
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/mockData";

const Header = () => {
  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 px-6 border-b border-border/40 flex items-center justify-between bg-background/80 backdrop-blur-md z-10 sticky top-0">
      <div className="flex items-center">
        <h1 className="text-xl font-medium tracking-tight">
          <span className="text-primary">RTO</span> Tracker
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden sm:inline-block">
            {currentUser.name}
          </span>
          <Avatar className="h-8 w-8 transition-transform hover:scale-105">
            <AvatarImage src="" alt={currentUser.name} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
