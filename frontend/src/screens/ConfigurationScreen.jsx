import React, { useState } from 'react';

export default function ConfigurationScreen({ devices }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Configuration</h2>
        <p className="text-gray-600 mt-1">Manage devices, rules, and automation</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {['devices', 'rules', 'automation', 'schedules'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition ${activeTab === tab
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'devices' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3">All Devices</h3>
            {Object.values(devices).map((device) => {
              const Icon = device.iconComponent;
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`w-full text-left p-4 rounded-lg transition ${selectedDevice?.id === device.id
                    ? 'bg-indigo-50 border-2 border-indigo-600'
                    : 'bg-white border border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${device.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{device.name}</p>
                      <p className="text-sm text-gray-500">{device.room}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {selectedDevice ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDevice.name}</h2>
                  <p className="text-gray-600">{selectedDevice.room}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Device Status</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">Select a device to configure</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


