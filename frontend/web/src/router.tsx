import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./navBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Apps from "./pages/Apps";
import Area from "./pages/Area";
import Settings from "./pages/Settings";
import Create from "./pages/Create";
import AppDetails from "./pages/AppDetails";
import Callback from "./pages/Callback";
import CreateAction from "./pages/CreateAction";
import CreateReaction from "./pages/CreateReaction";
import NotFound from "./pages/NotFound";
import SaveArea from "./pages/SaveArea";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <Profile /> },
      { path: "home", element: <Home /> },
      { path: "apps", element: <Apps /> },
      { path: "apps/:appName", element: <AppDetails /> },
      { path: "area", element: <Area /> },
      { path: "create", element: <Create /> },
      { path: "settings", element: <Settings /> },
      { path: "callback", element: <Callback /> },
      { path: "create/action", element: <CreateAction /> },
      { path: "create/reaction", element: <CreateReaction /> },
      { path: "create/save", element: <SaveArea /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
