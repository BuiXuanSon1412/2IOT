import { Link } from "react-router-dom";
import { HomeIcon, ListTreeIcon, SettingsIcon, LogOutIcon } from "lucide-react";

export default function Navbar({ currentPage, setCurrentPage }) {
  const menu = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Devices", path: "/devices", icon: ListTreeIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];
  
  return (
    // The w-64 class provides the fixed width for the sidebar
    <div className="bg-slate-900 text-white w-90 flex flex-col p-6 shadow-xl sticky top-0 min-h-screen">
      <div className="flex-1">
        <h1 className="text-md font-extrabold text-cyan-400 mb-8">SmartHome</h1>
        <nav className="flex flex-col space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path}
              >
                <button
                  key={item.path}
                  // Conditional styling based on the current state
                  className={`flex w-full items-center px-4 py-3 rounded-lg font-medium transition duration-200 hover:bg-slate-800 text-slate-300`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        to={"/login"}
      >
        <button
          className="mt-8 w-full flex items-center justify-center px-4 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition duration-200 shadow-lg"
        >
          <LogOutIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </Link>
    </div>
  );
}
