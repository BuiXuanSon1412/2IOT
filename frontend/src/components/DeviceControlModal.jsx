import { useState } from 'react';
import { X, Power, ThermometerSun, Droplets, Wind, Lightbulb, Lock, Unlock, Activity, Clock, AlertTriangle, Fan as FanIcon, RotateCw, Timer } from 'lucide-react';
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
        return <FanControl device={deviceState} onUpdate={handleUpdate} />;
      case 'light':
        return <LightControl device={deviceState} onUpdate={handleUpdate} />;
      case 'lock':
        return <LockControl device={deviceState} onUpdate={handleUpdate} />;
      case 'dht22':
        return <DHT22Sensor device={deviceState} />;
      case 'mq2':
        return <MQ2Sensor device={deviceState} />;
      case 'bh1750':
        return <BH1750Sensor device={deviceState} />;
      default:
        return <div className="text-gray-500 text-center py-8">No controls available</div>;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
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

// Fan Control Component
function FanControl({ device, onUpdate }) {
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
          {/* Speed Control */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                Fan Speed
              </label>
              <span className="text-lg font-bold text-gray-900">
                {device.speed === 0 ? 'Off' : `Level ${device.speed}`}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdate({ speed })}
                  className={`py-3 px-2 rounded-lg font-medium transition ${device.speed === speed
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {speed === 0 ? 'Off' : speed}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Control */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Auto-Off Timer
              </label>
              <span className="text-sm font-semibold text-gray-900">
                {device.timer === 0 ? 'Off' : `${device.timer} mins`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 30, 60, 120, 480].map((time) => (
                <button
                  key={time}
                  onClick={() => onUpdate({ timer: time })}
                  className={`py-2 px-2 rounded-lg text-sm font-medium transition ${device.timer === time
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {time === 0 ? 'Off' : `${time}m`}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Light Control Component
function LightControl({ device, onUpdate }) {
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
          className={`relative w-14 h-8 rounded-full transition ${device.power ? 'bg-yellow-500' : 'bg-gray-300'
            }`}
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
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => onUpdate({ brightness: 100, colorTemp: 5000 })}
                className="py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Bright
              </button>
              <button
                onClick={() => onUpdate({ brightness: 60, colorTemp: 4000 })}
                className="py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Normal
              </button>
              <button
                onClick={() => onUpdate({ brightness: 30, colorTemp: 2700 })}
                className="py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Warm
              </button>
              <button
                onClick={() => onUpdate({ brightness: 10, colorTemp: 2700 })}
                className="py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Night
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Lock Control Component
function LockControl({ device, onUpdate }) {
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

      {/* Auto Lock Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Timer className="w-5 h-5 text-gray-700" />
          <div>
            <p className="font-medium text-gray-900">Auto-Lock</p>
            <p className="text-sm text-gray-600">After {device.autoLockDelay}s</p>
          </div>
        </div>
        <button
          onClick={() => onUpdate({ autoLock: !device.autoLock })}
          className={`relative w-14 h-8 rounded-full transition ${device.autoLock ? 'bg-indigo-500' : 'bg-gray-300'
            }`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${device.autoLock ? 'translate-x-6' : ''}`}></span>
        </button>
      </div>

      {/* Last Access */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">Last Access</p>
        <p className="text-gray-900">{device.lastAccess}</p>
      </div>
    </div>
  );
}

// DHT22 Sensor Component (Temperature & Humidity)
function DHT22Sensor({ device }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-xl p-6 text-center">
          <ThermometerSun className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Temperature</p>
          <p className="text-4xl font-bold text-gray-900">{device.temperature}°C</p>
          <p className="text-xs text-gray-500 mt-2">Real-time reading</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <Droplets className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Humidity</p>
          <p className="text-4xl font-bold text-gray-900">{device.humidity}%</p>
          <p className="text-xs text-gray-500 mt-2">Real-time reading</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl ${device.temperature >= 18 && device.temperature <= 26
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-200'
          }`}>
          <p className="text-sm font-medium text-gray-700">Temperature Status</p>
          <p className={`font-semibold ${device.temperature >= 18 && device.temperature <= 26
            ? 'text-green-600'
            : 'text-yellow-600'
            }`}>
            {device.temperature >= 18 && device.temperature <= 26 ? 'Optimal' : 'Adjust Needed'}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${device.humidity >= 40 && device.humidity <= 60
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-200'
          }`}>
          <p className="text-sm font-medium text-gray-700">Humidity Status</p>
          <p className={`font-semibold ${device.humidity >= 40 && device.humidity <= 60
            ? 'text-green-600'
            : 'text-yellow-600'
            }`}>
            {device.humidity >= 40 && device.humidity <= 60 ? 'Optimal' : 'Adjust Needed'}
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-sm text-gray-600">📡 Read-Only Sensor</p>
        <p className="text-xs text-gray-500 mt-1">DHT22 Temperature & Humidity Monitor</p>
      </div>
    </div>
  );
}

// MQ-2 Gas Sensor Component
function MQ2Sensor({ device }) {
  const getStatusColor = () => {
    if (device.smokeDetected || device.lpgDetected || device.coDetected) return 'red';
    if (device.gasLevel > device.alertThreshold * 0.5) return 'yellow';
    return 'green';
  };

  const statusColor = getStatusColor();
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  return (
    <div className="space-y-2">
      {/* Main Status */}
      <div className={`rounded-xl p-6 text-center border-2 ${colorClasses[statusColor]}`}>
        <AlertTriangle className={`w-16 h-16 mx-auto mb-3 ${statusColor === 'red' ? 'text-red-600' :
          statusColor === 'yellow' ? 'text-yellow-600' : 'text-green-600'
          }`} />
        <p className="text-2xl font-bold mb-2">
          {statusColor === 'red' ? 'ALERT' :
            statusColor === 'yellow' ? 'CAUTION' : 'SAFE'}
        </p>
        <p className="text-sm opacity-80">Gas Level: {device.gasLevel} PPM</p>
      </div>

      {/* Gas Detection Status */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-4 rounded-xl text-center ${device.smokeDetected ? 'bg-red-100 border-2 border-red-400' : 'bg-gray-100'
          }`}>
          <p className="text-xs font-medium text-gray-700 mb-1">Smoke</p>
          <p className={`text-lg font-bold ${device.smokeDetected ? 'text-red-600' : 'text-gray-400'}`}>
            {device.smokeDetected ? 'DETECTED' : 'Clear'}
          </p>
        </div>
        <div className={`p-4 rounded-xl text-center ${device.lpgDetected ? 'bg-red-100 border-2 border-red-400' : 'bg-gray-100'
          }`}>
          <p className="text-xs font-medium text-gray-700 mb-1">LPG</p>
          <p className={`text-lg font-bold ${device.lpgDetected ? 'text-red-600' : 'text-gray-400'}`}>
            {device.lpgDetected ? 'DETECTED' : 'Clear'}
          </p>
        </div>
        <div className={`p-4 rounded-xl text-center ${device.coDetected ? 'bg-red-100 border-2 border-red-400' : 'bg-gray-100'
          }`}>
          <p className="text-xs font-medium text-gray-700 mb-1">CO</p>
          <p className={`text-lg font-bold ${device.coDetected ? 'text-red-600' : 'text-gray-400'}`}>
            {device.coDetected ? 'DETECTED' : 'Clear'}
          </p>
        </div>
      </div>

      {/* Threshold Display */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Gas Level vs Threshold</span>
          <span className="text-sm font-semibold text-gray-900">
            {device.gasLevel} / {device.alertThreshold} PPM
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${device.gasLevel > device.alertThreshold * 0.8 ? 'bg-red-500' :
              device.gasLevel > device.alertThreshold * 0.5 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            style={{ width: `${Math.min((device.gasLevel / device.alertThreshold) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-sm text-gray-600">📡 Read-Only Sensor</p>
        <p className="text-xs text-gray-500 mt-1">MQ-2 Gas Detection Monitor</p>
      </div>
    </div>
  );
}

// BH1750 Light Sensor Component
function BH1750Sensor({ device }) {
  const getConditionColor = () => {
    switch (device.condition) {
      case 'dark': return { bg: 'bg-gray-800', text: 'text-white', icon: '🌙' };
      case 'dim': return { bg: 'bg-blue-100', text: 'text-blue-900', icon: '🌥️' };
      case 'bright': return { bg: 'bg-yellow-100', text: 'text-yellow-900', icon: '☀️' };
      case 'very-bright': return { bg: 'bg-orange-100', text: 'text-orange-900', icon: '🔆' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-900', icon: '💡' };
    }
  };

  const colors = getConditionColor();

  return (
    <div className="space-y-2">
      {/* Main Light Level Display */}
      <div className={`rounded-xl p-4 flex items-center justify-between ${colors.bg}`}>
        <div className="text-2xl">
          {colors.icon}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-gray-900">
            {device.lightLevel}
          </span>
          <span className="text-sm text-gray-600">
            lux
          </span>
        </div>
        <div className={`text-sm font-semibold uppercase ${colors.text}`}>
          {device.condition}
        </div>
      </div>

      {/* Light Level Scale */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-3">Light Intensity Scale</p>
        <div className="relative w-full h-4 bg-gradient-to-r from-gray-800 via-yellow-300 to-orange-400 rounded-full">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg"
            style={{
              left: `${Math.min((device.lightLevel / 1000) * 100, 100)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0 lux</span>
          <span>1000+ lux</span>
        </div>
      </div>

      {/* Light Conditions Reference */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Dark</p>
          <p className="text-sm font-semibold text-gray-900">0-10 lux</p>
          <p className="text-xs text-gray-500">Night time</p>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Dim</p>
          <p className="text-sm font-semibold text-gray-900">10-100 lux</p>
          <p className="text-xs text-gray-500">Twilight</p>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Bright</p>
          <p className="text-sm font-semibold text-gray-900">100-500 lux</p>
          <p className="text-xs text-gray-500">Indoor lighting</p>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Very Bright</p>
          <p className="text-sm font-semibold text-gray-900">500+ lux</p>
          <p className="text-xs text-gray-500">Daylight</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-sm text-gray-600">📡 Read-Only Sensor</p>
        <p className="text-xs text-gray-500 mt-1">BH1750 Ambient Light Sensor</p>
      </div>
    </div>
  );
}
