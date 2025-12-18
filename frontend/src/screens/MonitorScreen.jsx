import React, { useState } from 'react';
import { Thermometer, Droplets, Wind, Activity } from 'lucide-react';

export default function MonitorScreen({ devices, floors }) {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const currentFloor = floors[selectedFloor];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Floor Monitor</h1>
          <p className="text-gray-600 mt-1">Real-time device status and environmental data</p>
        </div>
        <div className="flex gap-2">
          {floors.map((floor, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFloor(idx)}
              className={`px-6 py-2 rounded-lg font-medium transition ${selectedFloor === idx
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Thermometer className="w-6 h-6" />} label="Avg Temperature" value="23.5°C" status="optimal" />
        <StatCard icon={<Droplets className="w-6 h-6" />} label="Avg Humidity" value="55%" status="optimal" />
        <StatCard icon={<Wind className="w-6 h-6" />} label="Air Quality" value="Good" status="optimal" />
        <StatCard icon={<Activity className="w-6 h-6" />} label="Active Devices" value="12/15" status="warning" />
      </div>

      {/* Floor Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentFloor.name} Layout</h2>
        <div className="relative bg-gray-50 rounded-lg p-8" style={{ minHeight: '500px' }}>
          <svg viewBox="0 0 800 600" className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#grid)" />

            {currentFloor.rooms.map((room, idx) => (
              <g key={idx}>
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill="white"
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-indigo-50 transition"
                />
                <text x={room.x + room.width / 2} y={room.y + 30} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                  {room.name}
                </text>

                {room.devices.map((device, dIdx) => (
                  <g key={dIdx}>
                    <circle
                      cx={room.x + 30 + dIdx * 40}
                      cy={room.y + room.height - 30}
                      r="12"
                      fill={device.status === 'online' ? '#10b981' : '#ef4444'}
                      className="cursor-pointer hover:opacity-80"
                    />
                    <text
                      x={room.x + 30 + dIdx * 40}
                      y={room.y + room.height - 26}
                      textAnchor="middle"
                      className="text-xs fill-white font-bold"
                    >
                      {device.icon}
                    </text>
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, status }) {
  const statusColors = {
    optimal: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className={`inline-flex p-2 rounded-lg ${statusColors[status]}`}>{icon}</div>
      <p className="text-gray-600 text-sm mt-3">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
