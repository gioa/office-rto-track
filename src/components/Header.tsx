
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/data/currentUser";
import { Layers, Zap } from "lucide-react";

const Header = () => {
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
  return <header className="h-16 px-6 border-b border-border/40 flex items-center justify-between bg-background/80 backdrop-blur-md z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-8 w-8 bg-gradient-to-br from-primary/90 to-primary rounded-md mr-2">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-xl font-medium tracking-tight">
          <span className="text-primary">RTO</span> Tracker
        </h1>
      </div>
      
      <div className="flex items-center">
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
    </header>;
};
export default Header;
