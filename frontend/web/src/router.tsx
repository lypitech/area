import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Workflows from "./pages/Workflows";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "home", element: <Home /> },
      { path: "workflows", element: <Workflows /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
