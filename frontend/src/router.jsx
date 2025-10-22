import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useState } from 'react';
import Devices from "./pages/Devices";
import Settings from "./pages/Settings";

export default function AppRouter() {
  const initialDevices = [
    { name: "Temperature Sensor", value: "25°C", status: "Online" },
    { name: "Smart Light", value: "On", status: "Online" },
    { name: "Door Lock", value: "Locked", status: "Offline" },
    { name: "Humidity Sensor", value: "65%", status: "Online" },
  ];

  const [currentPage, setCurrentPage] = useState('/');
  const [devices, setDevices] = useState(initialDevices);

  return (
    <div className="flex min-h-screen bg-slate-900">
      <BrowserRouter>
        <Navbar />
        <main className="w-full flex-1 p-0 overflow-y-auto flex bg-slate-900">
          <Routes>
            <Route path="/" element={<Home devices={devices} setDevices={setDevices} />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/settings" element={<Settings />}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
