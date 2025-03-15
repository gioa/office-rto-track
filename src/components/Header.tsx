
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/data/currentUser";

const Header = () => {
  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 px-6 border-b border-border/40 flex items-center justify-between bg-background/80 backdrop-blur-md z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/5c8338d2-a7c3-400d-b76e-c57325ef3a97.png" 
            alt="Databricks Logo" 
            className="h-6 mr-2" 
          />
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
    </header>
  );
};

export default Header;
