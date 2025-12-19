import React, { useState } from 'react';
import { Thermometer, Droplets, Wind, Activity } from 'lucide-react';

export default function MonitorScreen({ floors }) {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const currentFloor = floors[selectedFloor];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Floor Monitor</h2>
        <p className="text-gray-600 text-sm mt-1">
          Real-time device status and environmental data
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard icon={<Thermometer className="w-5 h-5" />} label="Avg Temperature" value="23.5°C" status="optimal" />
        <StatCard icon={<Droplets className="w-5 h-5" />} label="Avg Humidity" value="55%" status="optimal" />
        <StatCard icon={<Wind className="w-5 h-5" />} label="Air Quality" value="Good" status="optimal" />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Active Devices" value="12/15" status="warning" />
      </div>

      {/* Floor Plan */}
      <div className="bg-white shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Floor Layout</h3>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          >
            {floors.map((floor, idx) => (
              <option key={idx} value={idx}>
                {floor.name}
              </option>
            ))}
          </select>
        </div>

        {/* SVG FLOOR PLAN */}
        <div className="relative bg-gray-100 border border-gray-300">
          <svg viewBox="0 0 600 400" className="w-full h-auto">
            {/* Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="400" fill="url(#grid)" />

            {currentFloor.rooms.map((room, idx) => (
              <g key={idx}>
                {/* Room */}
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  rx="0"
                />

                {/* Room name */}
                <text
                  x={room.x + room.width / 2}
                  y={room.y + 18}
                  textAnchor="middle"
                  className="fill-gray-700 text-xs font-semibold pointer-events-none"
                >
                  {room.name}
                </text>

                {/* Devices */}
                {room.devices.map((device, dIdx) => (
                  <g key={dIdx}>
                    <circle
                      cx={room.x + 18 + dIdx * 30}
                      cy={room.y + room.height - 18}
                      r="10"
                      fill={device.status === 'online' ? '#10b981' : '#ef4444'}
                    />
                    <text
                      x={room.x + 18 + dIdx * 30}
                      y={room.y + room.height - 14}
                      textAnchor="middle"
                      className="fill-white text-sm pointer-events-none"
                    >
                      {device.icon}
                    </text>
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-3 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
      <div className={`inline-flex p-2 rounded-lg ${statusColors[status]}`}>{icon}</div>
      <p className="text-gray-600 text-sm mt-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
