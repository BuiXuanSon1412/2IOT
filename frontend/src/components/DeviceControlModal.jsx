import { useState } from 'react';
import { X, Power, ThermometerSun, Droplets, Wind, Lightbulb, Lock, Unlock, Activity, Clock } from 'lucide-react';
import { StatCard } from './StatCard';

export function DeviceControlModal({ device, onClose, onUpdate }) {
  const [deviceState, setDeviceState] = useState(device);

  const handleUpdate = (updates) => {
    const newState = { ...deviceState, ...updates };
    setDeviceState(newState);
    onUpdate && onUpdate(newState);
  };

  const renderDeviceControl = () => {
    switch (deviceState.type) {
      case 'fan':
        return <TemperatureControl device={deviceState} onUpdate={handleUpdate} />;
      case 'light':
        return <LightControl device={deviceState} onUpdate={handleUpdate} />;
      case 'filter':
        return <AirPurifierControl device={deviceState} onUpdate={handleUpdate} />;
      case 'lock':
        return <SecurityControl device={deviceState} onUpdate={handleUpdate} />;
      case 'dht22':
        return <DHTSensor device={deviceState} onUpdate={handleUpdate} />;
      case 'mq2':
        return <DHTSensor device={deviceState} onUpdate={handleUpdate} />;
      case 'bh1750':
        return <LightControl device={deviceState} onUpdate={handleUpdate} />;
      default:
        return <div className="text-gray-500 text-center py-8">No controls available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-4xl p-3 rounded-xl ${deviceState.status === 'online' ? 'bg-green-50' : 'bg-red-50'}`}>
              {deviceState.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{deviceState.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-600">{deviceState.room}</p>
                <span className={`flex items-center gap-1 text-sm ${deviceState.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${deviceState.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {deviceState.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Device Stats */}
          {deviceState.energyUsage && (
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Activity className="w-5 h-5" />}
                label="Energy Usage"
                value={deviceState.energyUsage}
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Last Updated"
                value={deviceState.lastUpdated}
              />
            </div>
          )}

          {/* Device Controls */}
          {renderDeviceControl()}
        </div>
      </div>
    </div>
  );
}

// Temperature Control (AC/Heater)
export function TemperatureControl({ device, onUpdate }) {
  return (
    <div className="space-y-6">
      {/* Power Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Power className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-900">Power</span>
        </div>
        <button
          onClick={() => onUpdate({ power: !device.power })}
          className={`relative w-14 h-8 rounded-full transition ${device.power ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${device.power ? 'translate-x-6' : ''}`}></span>
        </button>
      </div>

      {device.power && (
        <>
          {/* Temperature Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <ThermometerSun className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Current</p>
              <p className="text-3xl font-bold text-gray-900">{device.currentTemp}°C</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <ThermometerSun className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Target</p>
              <p className="text-3xl font-bold text-gray-900">{device.targetTemp}°C</p>
            </div>
          </div>

          {/* Temperature Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Set Temperature: {device.targetTemp}°C
            </label>
            <input
              type="range"
              min="16"
              max="30"
              value={device.targetTemp}
              onChange={(e) => onUpdate({ targetTemp: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>16°C</span>
              <span>30°C</span>
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {['cool', 'heat', 'auto'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdate({ mode })}
                  className={`py-2 px-4 rounded-lg font-medium capitalize transition ${device.mode === mode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fan Speed</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdate({ fanSpeed: speed })}
                  className={`py-2 px-4 rounded-lg font-medium capitalize transition ${device.fanSpeed === speed
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Humidity Display */}
          {device.dht && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Humidity</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{device.humidity}%</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Light Control
export function LightControl({ device, onUpdate }) {
  return (
    <div className="space-y-6">
      {/* Power Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Power className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-900">Power</span>
        </div>
        <button
          onClick={() => onUpdate({ power: !device.power })}
          className={`relative w-14 h-8 rounded-full transition ${device.power ? 'bg-yellow-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${device.power ? 'translate-x-6' : ''}`}></span>
        </button>
      </div>

      {device.power && (
        <>
          {/* Brightness Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Brightness: {device.brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.brightness}
              onChange={(e) => onUpdate({ brightness: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

          {/* Color Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Temperature: {device.colorTemp}K
            </label>
            <input
              type="range"
              min="2700"
              max="6500"
              step="100"
              value={device.colorTemp}
              onChange={(e) => onUpdate({ colorTemp: parseInt(e.target.value) })}
              className="w-full h-2 bg-gradient-to-r from-yellow-300 to-blue-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Warm</span>
              <span>Cool</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdate({ brightness: 100, colorTemp: 5000 })}
                className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Bright
              </button>
              <button
                onClick={() => onUpdate({ brightness: 50, colorTemp: 4000 })}
                className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Normal
              </button>
              <button
                onClick={() => onUpdate({ brightness: 20, colorTemp: 2700 })}
                className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Dim
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Air Purifier Control
export function AirPurifierControl({ device, onUpdate }) {
  return (
    <div className="space-y-6">
      {/* Power Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Power className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-900">Power</span>
        </div>
        <button
          onClick={() => onUpdate({ power: !device.power })}
          className={`relative w-14 h-8 rounded-full transition ${device.power ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${device.power ? 'translate-x-6' : ''}`}></span>
        </button>
      </div>

      {device.power && (
        <>
          {/* Air Quality Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-xl p-4 text-center ${device.airQuality === 'Good' ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <Wind className={`w-8 h-8 mx-auto mb-2 ${device.airQuality === 'Good' ? 'text-green-600' : 'text-yellow-600'}`} />
              <p className="text-sm text-gray-600">Air Quality</p>
              <p className="text-2xl font-bold text-gray-900">{device.airQuality}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">PM2.5</p>
              <p className="text-2xl font-bold text-gray-900">{device.pm25} μg/m³</p>
            </div>
          </div>

          {/* Fan Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fan Speed</label>
            <div className="grid grid-cols-4 gap-2">
              {['auto', 'low', 'medium', 'high'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdate({ fanSpeed: speed })}
                  className={`py-2 px-4 rounded-lg font-medium capitalize transition ${device.fanSpeed === speed
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Life */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Filter Life</span>
              <span className="text-sm font-semibold text-gray-900">{device.filterLife}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${device.filterLife > 50 ? 'bg-green-500' : device.filterLife > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${device.filterLife}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Security Control (Lock)
export function SecurityControl({ device, onUpdate }) {
  return (
    <div className="space-y-6">
      {/* Lock Status */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
        {device.locked ? (
          <Lock className="w-16 h-16 text-indigo-600 mx-auto mb-3" />
        ) : (
          <Unlock className="w-16 h-16 text-orange-600 mx-auto mb-3" />
        )}
        <p className="text-2xl font-bold text-gray-900 mb-2">
          {device.locked ? 'Locked' : 'Unlocked'}
        </p>
        <button
          onClick={() => onUpdate({ locked: !device.locked })}
          className={`px-6 py-3 rounded-lg font-semibold transition ${device.locked
            ? 'bg-orange-600 hover:bg-orange-700 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
        >
          {device.locked ? 'Unlock Door' : 'Lock Door'}
        </button>
      </div>

      {/* Battery Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <span className="font-medium text-gray-700">Battery Level</span>
        <div className="flex items-center gap-2">
          <div className="w-32 bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${device.battery > 50 ? 'bg-green-500' : device.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${device.battery}%` }}
            ></div>
          </div>
          <span className="font-bold text-gray-900">{device.battery}%</span>
        </div>
      </div>

      {/* Last Access */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">Last Access</p>
        <p className="text-gray-900">{device.lastAccess}</p>
      </div>

      {/* Access Log */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Recent Access</p>
        <div className="space-y-2">
          {device.accessLog.map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-gray-900">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// DHT Sensor (Read-only)
export function DHTSensor({ device }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Humidity</p>
          <p className="text-3xl font-bold text-gray-900">{device.humidity}%</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <ThermometerSun className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Temperature</p>
          <p className="text-3xl font-bold text-gray-900">{device.temperature}°C</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-sm text-gray-600">This is a read-only sensor</p>
        <p className="text-sm text-gray-600 mt-1">No manual controls available</p>
      </div>
    </div>
  );
}

