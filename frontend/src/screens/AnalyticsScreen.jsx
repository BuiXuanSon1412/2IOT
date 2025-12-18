import React from 'react';

export default function AnalyticsScreen() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Energy consumption, trends, and optimization</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Today's Energy" value="45.2 kWh" change="-12%" positive={true} />
        <MetricCard label="Monthly Cost" value="$127.50" change="+5%" positive={false} />
        <MetricCard label="Efficiency Score" value="87%" change="+3%" positive={true} />
        <MetricCard label="Carbon Saved" value="23 kg" change="+15%" positive={true} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Consumption (7 Days)</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[42, 38, 45, 40, 48, 35, 45].map((value, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-indigo-600 rounded-t-lg hover:bg-indigo-700 transition cursor-pointer"
                style={{ height: `${(value / 50) * 100}%` }}
              ></div>
              <p className="text-xs text-gray-600 mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, positive }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      <p className={`text-sm mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change} vs last period
      </p>
    </div>
  );
}
