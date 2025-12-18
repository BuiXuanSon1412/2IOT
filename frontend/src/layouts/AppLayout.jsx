import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Navbar />
      <main className="flex-1 overflow-y-auto bg-slate-900">
        <Outlet />
      </main>
    </div>
  );
};
