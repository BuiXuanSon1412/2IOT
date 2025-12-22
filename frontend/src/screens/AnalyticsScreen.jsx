import { useState } from 'react';
import { mockDeviceDetails, mockFloors } from '../data/mockData';

// ============= COMPONENTS =============

function EnergyOverviewCards() {
  const metrics = [
    {
      label: "Today's Energy",
      value: "4.2 kWh",
      cost: "$0.63",
      change: "-12%",
      positive: true,
      icon: "⚡",
      detail: "vs yesterday"
    },
    {
      label: "This Week",
      value: "32.8 kWh",
      cost: "$4.92",
      change: "+5%",
      positive: false,
      icon: "📊",
      detail: "vs last week"
    },
    {
      label: "This Month",
      value: "127.5 kWh",
      cost: "$19.13",
      change: "-3%",
      positive: true,
      icon: "📅",
      detail: "vs last month"
    },
    {
      label: "Efficiency Score",
      value: "87/100",
      cost: "Excellent",
      change: "+3%",
      positive: true,
      icon: "🎯",
      detail: "vs last month"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{metric.icon}</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded ${metric.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
              {metric.change}
            </span>
          </div>
          <p className="text-sm text-gray-600">{metric.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
          <p className="text-sm text-gray-500 mt-1">{metric.cost}</p>
          <p className="text-xs text-gray-400 mt-2">{metric.detail}</p>
        </div>
      ))}
    </div>
  );
}

function DeviceEnergyBreakdown({ devices }) {
  // Calculate energy usage by device type
  const deviceConsumption = Object.values(devices).reduce((acc, device) => {
    if (!device.energyUsage) return acc;

    const type = device.type;
    const usage = parseFloat(device.energyUsage.replace(/[^\d.]/g, ''));

    if (!acc[type]) {
      acc[type] = { total: 0, count: 0, name: type };
    }
    acc[type].total += usage;
    acc[type].count += 1;
    return acc;
  }, {});

  const sorted = Object.values(deviceConsumption)
    .sort((a, b) => b.total - a.total);

  const totalEnergy = sorted.reduce((sum, item) => sum + item.total, 0);

  const typeIcons = {
    fan: '🌀',
    light: '💡',
    lock: '🔒',
    dht22: '🌡️',
    mq2: '💨',
    bh1750: '☀️'
  };

  const typeNames = {
    fan: 'Fans',
    light: 'Lights',
    lock: 'Locks',
    dht22: 'Climate Sensors',
    mq2: 'Gas Sensors',
    bh1750: 'Light Sensors'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy by Device Type</h3>

      <div className="space-y-3">
        {sorted.map((item, idx) => {
          const percentage = ((item.total / totalEnergy) * 100).toFixed(1);
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{typeIcons[item.name]}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {typeNames[item.name] || item.name}
                  </span>
                  <span className="text-xs text-gray-500">({item.count} devices)</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.total.toFixed(3)} kWh</p>
                  <p className="text-xs text-gray-500">{percentage}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EnergyTrendChart() {
  const weekData = [
    { day: 'Mon', energy: 4.2, cost: 0.63 },
    { day: 'Tue', energy: 3.8, cost: 0.57 },
    { day: 'Wed', energy: 4.5, cost: 0.68 },
    { day: 'Thu', energy: 4.0, cost: 0.60 },
    { day: 'Fri', energy: 4.8, cost: 0.72 },
    { day: 'Sat', energy: 3.5, cost: 0.53 },
    { day: 'Sun', energy: 4.2, cost: 0.63 }
  ];

  const maxEnergy = Math.max(...weekData.map(d => d.energy));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">7-Day Energy Trend</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg font-medium">
            7 Days
          </button>
          <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            30 Days
          </button>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-2">
        {weekData.map((data, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center group">
            <div className="relative w-full">
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg hover:from-indigo-700 hover:to-indigo-500 transition cursor-pointer"
                style={{ height: `${(data.energy / maxEnergy) * 200}px` }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                  <p className="font-bold">{data.energy} kWh</p>
                  <p className="text-gray-300">${data.cost.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">{data.day}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded"></div>
          <span className="text-gray-600">Energy (kWh)</span>
        </div>
        <div className="text-gray-500">
          Total: <span className="font-bold text-gray-900">28.0 kWh</span>
        </div>
      </div>
    </div>
  );
}

function RoomEnergyUsage({ devices, floors }) {
  const roomUsage = {};

  floors.forEach(floor => {
    floor.rooms.forEach(room => {
      let totalEnergy = 0;
      let deviceCount = 0;

      room.devices.forEach(deviceId => {
        const device = devices[deviceId];
        if (device?.energyUsage) {
          totalEnergy += parseFloat(device.energyUsage.replace(/[^\d.]/g, ''));
          deviceCount++;
        }
      });

      if (deviceCount > 0) {
        roomUsage[room.name] = {
          energy: totalEnergy,
          devices: deviceCount,
          floor: floor.name
        };
      }
    });
  });

  const sortedRooms = Object.entries(roomUsage)
    .sort(([, a], [, b]) => b.energy - a.energy)
    .slice(0, 6); // Top 6 rooms

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy by Room</h3>

      <div className="space-y-3">
        {sortedRooms.map(([roomName, data], idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🏠'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{roomName}</p>
                <p className="text-xs text-gray-500">{data.floor} • {data.devices} devices</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{data.energy.toFixed(3)} kWh</p>
              <p className="text-xs text-gray-500">${(data.energy * 0.15).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeakUsageTimes() {
  const hourlyData = [
    { hour: '00:00', usage: 0.12 },
    { hour: '06:00', usage: 0.25 },
    { hour: '12:00', usage: 0.45 },
    { hour: '18:00', usage: 0.62 },
    { hour: '21:00', usage: 0.48 },
    { hour: '23:00', usage: 0.28 }
  ];

  const maxUsage = Math.max(...hourlyData.map(d => d.usage));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Usage Times</h3>

      <div className="space-y-3">
        {hourlyData.map((data, idx) => {
          const percentage = (data.usage / maxUsage) * 100;
          const isPeak = data.usage === maxUsage;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{data.hour}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-bold">{data.usage.toFixed(2)} kW</span>
                  {isPeak && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                      Peak
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${isPeak ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Peak usage at 18:00 (6 PM). Consider shifting non-essential devices to off-peak hours to save costs.
        </p>
      </div>
    </div>
  );
}

function EnvironmentalImpact() {
  const metrics = [
    { label: 'CO₂ Saved', value: '23.4', unit: 'kg', icon: '🌱', color: 'green' },
    { label: 'Trees Equivalent', value: '1.2', unit: 'trees', icon: '🌳', color: 'green' },
    { label: 'Water Saved', value: '45', unit: 'liters', icon: '💧', color: 'blue' },
    { label: 'Efficiency Rank', value: 'Top 15%', unit: 'in area', icon: '🏅', color: 'yellow' }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact (This Month)</h3>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-sm text-gray-600">{metric.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.unit}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          Your energy-efficient practices this month are equivalent to <strong>driving 89 km less</strong> or <strong>planting 1.2 trees</strong>. Keep up the great work! 🎉
        </p>
      </div>
    </div>
  );
}

function CostProjection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cost Projection</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Current Month (So far)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">$19.13</p>
            <p className="text-xs text-gray-500 mt-1">21 days • 127.5 kWh</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Projected Total</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">$27.30</p>
            <p className="text-xs text-green-600 mt-1">$2.70 under budget</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Savings vs Last Month</span>
            <span className="text-lg font-bold text-green-600">$3.45</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            You're on track to save 11.2% compared to last month
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Last Month</p>
            <p className="text-lg font-bold text-gray-900">$30.75</p>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg border-2 border-indigo-200">
            <p className="text-xs text-indigo-600 font-semibold">This Month</p>
            <p className="text-lg font-bold text-indigo-600">~$27.30</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Budget</p>
            <p className="text-lg font-bold text-gray-900">$30.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= MAIN SCREEN =============

export default function AnalyticsScreen() {
  const [devices] = useState(mockDeviceDetails);
  const [floors] = useState(mockFloors);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Analytics & Insights</h2>
        <p className="text-gray-600 mt-1">Energy consumption, trends, and optimization</p>
      </div>

      {/* Overview Cards */}
      <EnergyOverviewCards />

      {/* First Row: Energy Trend & Device Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <EnergyTrendChart />
        <DeviceEnergyBreakdown devices={devices} />
      </div>

      {/* Second Row: Room Usage & Peak Times */}
      <div className="grid grid-cols-2 gap-6">
        <RoomEnergyUsage devices={devices} floors={floors} />
        <PeakUsageTimes />
      </div>

      {/* Third Row: Environmental Impact & Cost Projection */}
      <div className="grid grid-cols-2 gap-6">
        <EnvironmentalImpact />
        <CostProjection />
      </div>
    </div>
  );
}
