
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
        <img 
          src="/lovable-uploads/6bee558b-bfa1-4623-9abc-ee85b6d9a7ae.png" 
          alt="Databricks Logo" 
          className="h-6 w-6 text-primary" 
        />
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
