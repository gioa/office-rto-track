import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/data/currentUser";
const Header = () => {
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
  return <header className="h-16 px-6 border-b border-border/40 flex items-center justify-between bg-background/80 backdrop-blur-md z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <img alt="Databricks Logo" className="h-6 mr-2" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMyIiBoZWlnaHQ9IjIyIiB2aWV3Qm94PSIwIDAgMTMyIDIyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xOC4zMTggOS4yNzUtOC42MzEgNC44NTlMLjQ0NSA4Ljk0MiAwIDkuMTgydjMuNzdsOS42ODcgNS40MzEgOC42My00Ljg0djEuOTk1bC04LjYzIDQuODYtOS4yNDItNS4xOTItLjQ0NS4yNHYuNjQ2bDkuNjg3IDUuNDMyIDkuNjY4LTUuNDMydi0zLjc2OWwtLjQ0NS0uMjQtOS4yMjMgNS4xNzMtOC42NS00Ljg0VjEwLjQybDguNjUgNC44NCA5LjY2OC01LjQzVjYuMTE0bC0uNDgyLS4yNzctOS4xODYgNS4xNTVMMS40ODIgNi40MWw4LjIwNS00LjYgNi43NDEgMy43ODcuNTkzLS4zMzJ2LS40NjJMOS42ODcuNjg0IDAgNi4xMTV2LjU5Mmw5LjY4NyA1LjQzMiA4LjYzLTQuODZ6IiBmaWxsPSIjRUUzRDJDIi8+PHBhdGggZD0iTTM3LjQ0OSAxOC40NDNWMS44NTJoLTIuNTU2djYuMjA3YzAgLjA5My0uMDU2LjE2Ny0uMTQ4LjIwNGEuMjMuMjMgMCAwIDEtLjI0LS4wNTZjLS44NzEtMS4wMTYtMi4yMjMtMS41ODktMy43MDUtMS41ODktMy4xNjcgMC01LjY1IDIuNjYtNS42NSA2LjA2IDAgMS42NjMuNTc1IDMuMTk3IDEuNjMgNC4zMjRhNS40NCA1LjQ0IDAgMCAwIDQuMDIgMS43MzZjMS40NjMgMCAyLjgxNS0uNjEgMy43MDQtMS42NjIuMDU2LS4wNzQuMTY3LS4wOTMuMjQtLjA3NC4wOTMuMDM3LjE1LjExLjE1LjIwM3YxLjIzOHptLTYuMDkzLTIuMDE0Yy0yLjAzOCAwLTMuNjMtMS42NDQtMy42My0zLjc1IDAtMi4xMDcgMS41OTItMy43NTEgMy42My0zLjc1MXMzLjYzIDEuNjQ0IDMuNjMgMy43NS0xLjU5MyAzLjc1LTMuNjMgMy43NW0xOS43NjIgMi4wMTZWNi44OTZoLTIuNTM3VjguMDZjMCAuMDkzLS4wNTYuMTY2LS4xNDkuMjAzYS4yLjIgMCAwIDEtLjI0LS4wNzNjLS44NTItMS4wMTctMi4xODYtMS41OS0zLjcwNS0xLjU5LTMuMTY3IDAtNS42NDkgMi42NjEtNS42NDkgNi4wNiAwIDMuNCAyLjQ4MiA2LjA2IDUuNjUgNi4wNiAxLjQ2MyAwIDIuODE1LS42MSAzLjcwNC0xLjY4LjA1NS0uMDc1LjE2Ni0uMDkzLjI0LS4wNzUuMDkzLjAzNy4xNDkuMTExLjE0OS4yMDR2MS4yNTZoMi41Mzd6bS02LjA1Ni0yLjAxNGMtMi4wMzggMC0zLjYzLTEuNjQ1LTMuNjMtMy43NSAwLTIuMTA3IDEuNTkyLTMuNzUxIDMuNjMtMy43NTFzMy42MyAxLjY0NCAzLjYzIDMuNzUtMS41OTMgMy43NS0zLjYzIDMuNzVtMjcuNzgxIDIuMDE1VjYuODk2aC0yLjUzOFY4LjA2YzAgLjA5My0uMDU1LjE2Ni0uMTQ4LjIwM3MtLjE4NSAwLS4yNC0uMDczYy0uODUzLTEuMDE3LTIuMTg2LTEuNTktMy43MDUtMS41OS0zLjE4NiAwLTUuNjQ5IDIuNjYxLTUuNjQ5IDYuMDggMCAzLjQxNyAyLjQ4MiA2LjA2IDUuNjQ5IDYuMDYgMS40NjMgMCAyLjgxNS0uNjEgMy43MDQtMS42ODIuMDU2LS4wNzQuMTY3LS4wOTMuMjQxLS4wNzQuMDkzLjAzNy4xNDguMTEuMTQ4LjIwM3YxLjI1NnptLTYuMDU3LTIuMDE0Yy0yLjAzNyAwLTMuNjMtMS42NDUtMy42My0zLjc1IDAtMi4xMDcgMS41OTMtMy43NTEgMy42My0zLjc1MXMzLjYzIDEuNjQ0IDMuNjMgMy43NS0xLjU5MyAzLjc1LTMuNjMgMy43NW0xMC43MDYuNjQ3Yy4wMTkgMCAuMDU2LS4wMTkuMDc0LS4wMTkuMDU2IDAgLjEzLjAzNy4xNjcuMDc0Ljg3IDEuMDE2IDIuMjIyIDEuNTg5IDMuNzA0IDEuNTg5IDMuMTY3IDAgNS42NS0yLjY2IDUuNjUtNi4wNiAwLTEuNjYzLS41NzUtMy4xOTYtMS42My00LjMyM2E1LjQ0IDUuNDQgMCAwIDAtNC4wMi0xLjczN2MtMS40NjMgMC0yLjgxNS42MS0zLjcwNCAxLjY2My0uMDU2LjA3NC0uMTQ4LjA5Mi0uMjQuMDc0LS4wOTMtLjAzNy0uMTQ5LS4xMTEtLjE0OS0uMjA0VjEuODUyaC0yLjU1NnYxNi41OWgyLjU1NlYxNy4yOGMwLS4wOTMuMDU2LS4xNjYuMTQ4LS4yMDNtLS4yNi00LjM5OGMwLTIuMTA2IDEuNTk0LTMuNzUgMy42MzEtMy43NXMzLjYzIDEuNjQ0IDMuNjMgMy43NS0xLjU5MyAzLjc1LTMuNjMgMy43NS0zLjYzLTEuNjYyLTMuNjMtMy43NW0xNy4yNDQtMy40MTZjLjI0IDAgLjQ2My4wMTkuNjEuMDU2VjYuNjk1YTIuNCAyLjQgMCAwIDAtLjQyNS0uMDM3Yy0xLjMzNCAwLTIuNTU2LjY4NC0zLjIwNCAxLjc3NC0uMDU2LjA5Mi0uMTQ5LjEzLS4yNDEuMDkyYS4yMi4yMiAwIDAgMS0uMTY3LS4yMDNWNi44OThoLTIuNTM3djExLjU2NmgyLjU1NnYtNS4xYzAtMi41MyAxLjI5Ni00LjEgMy40MDgtNC4xbTQuODE1LTIuMzY3aC0yLjU5M3YxMS41NjZoMi41OTN6TTk3Ljk1OCAxLjg3YTEuNTcxIDEuNTcxIDAgMSAwIDAgMy4xNDEgMS41NzEgMS41NzEgMCAxIDAgMC0zLjE0bTguOTI4IDQuNzI5Yy0zLjU1NiAwLTYuMTMxIDIuNTUtNi4xMzEgNi4wOCAwIDEuNzE3LjYxMiAzLjI1IDEuNzA0IDQuMzYgMS4xMTIgMS4xMDggMi42NjcgMS43MTggNC40MDggMS43MTggMS40NDUgMCAyLjU1Ni0uMjc3IDQuNjY4LTEuODNsLTEuNDYzLTEuNTMzYy0xLjAzOC42ODQtMi4wMDEgMS4wMTYtMi45NDUgMS4wMTYtMi4xNDkgMC0zLjc2LTEuNjA3LTMuNzYtMy43MzJzMS42MTEtMy43MzIgMy43Ni0zLjczMmMxLjAxOCAwIDEuOTYzLjMzMyAyLjkwOCAxLjAxNmwxLjYyOS0xLjUzM2MtMS45MDctMS42MjYtMy42My0xLjgzLTQuNzc4LTEuODNtOS4xNDkgNi43NjJhLjIuMiAwIDAgMSAuMTQ5LS4wNTVoLjAxOGMuMDU2IDAgLjExMS4wMzcuMTY3LjA3M2w0LjA5MyA1LjA2M2gzLjE0OWwtNS4yOTctNi4zOTNjLS4wNzUtLjA5Mi0uMDc1LS4yMjIuMDE4LS4yOTVsNC44NzEtNC44NmgtMy4xM2wtNC4yMDQgNC4yMTNjLS4wNTYuMDU1LS4xNDguMDc0LS4yNDEuMDU1YS4yMy4yMyAwIDAgMS0uMTMtLjIwM1YxLjg3aC0yLjU3NHYxNi41OTFoMi41NTZ2LTQuNTA4YzAtLjA1NS4wMTgtLjEzLjA3NC0uMTY2eiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0xMjcuNzc2IDE4LjczOWMyLjA5MyAwIDQuMjIzLTEuMjc1IDQuMjIzLTMuNjk1IDAtMS41ODktMS0yLjY4LTMuMDM3LTMuMzQ0bC0xLjM5LS40NjJjLS45NDQtLjMxNC0xLjM4OS0uNzU4LTEuMzg5LTEuMzY3IDAtLjcwMi42My0xLjE4MyAxLjUxOS0xLjE4My44NTIgMCAxLjYxMS41NTUgMi4wOTMgMS41MTVsMi4wNTYtMS4xMDhjLS43NTktMS41NTItMi4zMzQtMi41MTMtNC4xNDktMi41MTMtMi4yOTcgMC0zLjk2MyAxLjQ3OC0zLjk2MyAzLjQ5MiAwIDEuNjA3Ljk2MyAyLjY3OSAyLjk0NCAzLjMwN2wxLjQyNy40NjJjMSAuMzE0IDEuNDI2LjcyIDEuNDI2IDEuMzY3IDAgLjk4LS45MDggMS4zMy0xLjY4NiAxLjMzLTEuMDM3IDAtMS45NjMtLjY2NS0yLjQwNy0xLjc1NWwtMi4wOTMgMS4xMDljLjY4NSAxLjc1NSAyLjM3IDIuODQ1IDQuNDI2IDIuODQ1bS02OS41NDYtLjExMWMuODE1IDAgMS41MzgtLjA3NCAxLjk0NS0uMTN2LTIuMjE2YTE0IDE0IDAgMCAxLTEuMjc4LjA3M2MtMS4wMzcgMC0xLjgzMy0uMTg0LTEuODMzLTIuNDJWOS4xODdjMC0uMTMuMDkyLS4yMjIuMjIyLS4yMjJoMi41VjYuODc3aC0yLjVhLjIxNC4yMTQgMCAwIDEtLjIyMi0uMjIxVjMuMzNoLTIuNTU2djMuMzQ0YzAgLjEzLS4wOTMuMjIyLS4yMjMuMjIyaC0xLjc3OHYyLjA4OGgxLjc3OGMuMTMgMCAuMjIzLjA5Mi4yMjMuMjIxdjUuMzc3YzAgNC4wNDYgMi43MDQgNC4wNDYgMy43MjIgNC4wNDYiIGZpbGw9IiMwMDAiLz48L3N2Zz4=" />
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