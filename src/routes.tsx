
import { RouteObject } from "react-router-dom";
import Index from "./pages/Index";
import AddEntry from "./pages/AddEntry";
import NotFound from "./pages/NotFound";

// Application routes
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/add-entry",
    element: <AddEntry />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
