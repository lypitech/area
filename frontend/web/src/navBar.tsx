import { useState, useRef, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Icon from "./components/icons/icons";
import { Button } from "./components/Button";
import { isLoggedIn, logout } from "./utils/auth";
import { API_ROUTES } from "./config/api";

export default function NavBar() {
  const nav = useNavigate();
  const position = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn() && position.pathname !== "/register") {
      nav("/");
    }
  }, [nav]);

  // Refresh token
  useEffect(() => {
    console.log("Refreshing token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const res = fetch(API_ROUTES.auth.refresh, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      res
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("access_token", data.access_token);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [nav]);

  // Handle hover open/close only if not locked
  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  const isActive = (path: string) => {
    return path === position.pathname;
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar */}
      {isLoggedIn() && (
        <div
          ref={ref}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`fixed left-0 top-0 z-[9999] h-full flex flex-col justify-between transition-all duration-300 ease-in-out outline outline-gray-200 bg-white ${
            open ? "w-56" : "w-16"
          }`}
        >
          {/* Top section */}
          <div className="flex flex-col items-start gap-2 pt-4 px-3">
            {/* Home */}
            <Button
              onClick={() => nav("/home")}
              className={`flex items-center ${
                open ? "justify-start gap-3 w-full" : "justify-center w-10 h-10"
              } rounded-lg  hover:bg-gray-100 hover:scale-[101%] transition
              ${
                isActive("/home")
                  ? "outline-black outline-2"
                  : "outline outline-gray-200"
              }`}
            >
              <Icon iconName="home" iconClass="w-6 h-6" />
              {open && <span>Home</span>}
            </Button>
            {/* Divider */}
            <div className="w-full h-px bg-gray-200 my-2" />

            {/* Create an Area */}
            <Button
              onClick={() => nav("/create")}
              className={`flex items-center ${
                open ? "justify-start gap-3 w-full" : "justify-center w-10 h-10"
              } rounded-lg bg-black hover:bg-neutral-700 hover:scale-[101%] transition ${
                isActive("/create")
                  ? "outline-neutral-600 outline-2"
                  : "outline outline-gray-200"
              }`}
            >
              <Icon iconName="plus" iconClass="text-white w-5 h-5" />
              {open && <span className="text-white">Create</span>}
            </Button>

            {/* Your Areas */}
            <Button
              onClick={() => nav("/area")}
              className={`flex items-center ${
                open ? "justify-start gap-3 w-full" : "justify-center w-10 h-10"
              } rounded-lg  hover:bg-gray-100 hover:scale-[101%] transition ${
                isActive("/area")
                  ? "outline-black outline-2"
                  : "outline outline-gray-200"
              }`}
            >
              <Icon iconName="yourSpace" iconClass="w-5 h-5" />
              {open && <span>Area</span>}
            </Button>

            {/* Your Apps */}
            <Button
              onClick={() => nav("/apps")}
              className={`flex items-center ${
                open ? "justify-start gap-3 w-full" : "justify-center w-10 h-10"
              } rounded-lg  hover:bg-gray-100 hover:scale-[101%] transition ${
                isActive("/apps")
                  ? "outline-black outline-2"
                  : "outline outline-gray-200"
              }`}
            >
              <Icon iconName="app" iconClass="w-5 h-5" />
              {open && <span>Apps</span>}
            </Button>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col items-start gap-2 py-4 px-3 ">
            <div className="w-full h-px bg-gray-200 my-2" />

            <Button
              onClick={() => nav("/settings")}
              className={`flex items-center ${
                open ? "justify-start gap-3 w-full" : "justify-center w-10 h-10"
              } rounded-lg  hover:bg-gray-100 hover:scale-[101%] transition ${
                isActive("/settings")
                  ? "outline-black outline-2"
                  : "outline outline-gray-200"
              }`}
            >
              <Icon iconName="settings" iconClass="w-5 h-5" />
              {open && <span>Settings</span>}
            </Button>

            <Button
              onClick={() => nav("/profile")}
              className={`flex items-center ${
                open ? "justify-start gap-3 w-full" : "justify-center w-10 h-10"
              } rounded-lg  hover:bg-gray-100 hover:scale-[101%] transition ${
                isActive("/profile")
                  ? "outline-black outline-2"
                  : "outline outline-gray-200"
              }`}
            >
              <Icon iconName="login" iconClass="w-5 h-5" />
              {open && <span>Profile</span>}
            </Button>

            <Button
              onClick={() => handleLogout()}
              className={`flex items-center ${
                open ? "justify-start gap-3 w-full" : "justify-center w-10 h-10"
              } rounded-lg  hover:bg-gray-100 hover:scale-[101%] transition`}
            >
              <Icon iconName="logout" iconClass="w-5 h-5" />
              {open && <span>Logout</span>}
            </Button>
          </div>
        </div>
      )}
      {/* Main content */}
      <main
        className={`flex-1 ${
          isLoggedIn() ? "ml-16" : "ml-0"
        } transition-all duration-300 ease-in-out`}
      >
        <Outlet />
      </main>
    </div>
  );
}
