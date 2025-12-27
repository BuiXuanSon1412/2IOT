import { useState } from 'react';
import { StatCard } from './StatCard';
import { X, Power, ThermometerSun, Droplets, Wind, Lightbulb, Lock, Unlock, Activity, Clock, AlertTriangle, Fan as FanIcon, RotateCw, Timer, AlertCircle } from 'lucide-react';
// Find DeviceControlModal component
export function DeviceControlModal({ device, onClose, onUpdate }) {
  const [deviceState, setDeviceState] = useState(device);
  const [isUpdating, setIsUpdating] = useState(false); // ADD THIS
  const [updateError, setUpdateError] = useState(null); // ADD THIS

  const handleUpdate = async (updates) => { // Make it async
    setIsUpdating(true); // ADD THIS
    setUpdateError(null); // ADD THIS

    const newState = { ...deviceState, ...updates };

    // Optimistically update UI
    setDeviceState(newState);

    // ADD ERROR HANDLING
    try {
      if (onUpdate) {
        await onUpdate(newState);
      }
    } catch (error) {
      // Revert on error
      setDeviceState(deviceState);
      setUpdateError(error.message || 'Failed to update device');
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderDeviceControl = () => {
    switch (deviceState.type) {
      case 'fan':
        return <FanControl device={deviceState} onUpdate={handleUpdate} isUpdating={isUpdating} />;
      case 'light':
        return <LightControl device={deviceState} onUpdate={handleUpdate} isUpdating={isUpdating} />;
      case 'lock':
        return <LockControl device={deviceState} onUpdate={handleUpdate} isUpdating={isUpdating} />;
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

        {/* ADD ERROR DISPLAY */}
        {updateError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{updateError}</p>
              <button
                onClick={() => setUpdateError(null)}
                className="text-xs text-red-600 hover:text-red-800 mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ADD LOADING OVERLAY */}
        {isUpdating && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-800">Updating device...</p>
          </div>
        )}

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
function FanControl({ device, onUpdate, isUpdating }) {
  // Helper to get characteristic value
  const getCharValue = (charName, defaultValue = 0) => {
    const char = device.characteristic?.find(c => c.name === charName);
    return char ? parseInt(char.value) || defaultValue : defaultValue;
  };

  // Helper to check if device is powered on
  const isPoweredOn = () => {
    const powerChar = device.characteristic?.find(c => c.name === 'power');
    return powerChar ? (powerChar.value === '1' || powerChar.value === 'on' || powerChar.value === 'true') : false;
  };

  // Get current values from characteristic array
  const power = isPoweredOn();
  const speed = getCharValue('speed', 0);
  const timer = getCharValue('timer', 0);

  // Helper to update characteristics
  const updateCharacteristic = (updates) => {
    // Get existing characteristics
    const currentChars = device.characteristic || [];

    // Create a map for easy lookup
    const charMap = new Map(currentChars.map(c => [c.name, c]));

    // Update or add new characteristics
    Object.entries(updates).forEach(([name, value]) => {
      charMap.set(name, {
        name,
        unit: getUnitForChar(name),
        value: String(value)
      });
    });

    // Convert back to array
    const updatedCharacteristics = Array.from(charMap.values());

    // Call parent update with new characteristic array
    onUpdate({
      ...device,
      characteristic: updatedCharacteristics
    });
  };

  // Helper to determine unit based on characteristic name
  const getUnitForChar = (charName) => {
    const unitMap = {
      'speed': '',        // Speed level (0-5)
      'rpm': 'rpm',       // RPM
      'timer': 'min',     // Timer in minutes
      'power': '',        // Power (0/1 or on/off)
      'brightness': '%',  // Brightness percentage
    };
    return unitMap[charName] || '';
  };

  return (
    <div className="space-y-6">
      {/* Power Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Power className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-900">Power</span>
        </div>
        <button
          onClick={() => updateCharacteristic({ power: power ? '0' : '1' })}
          disabled={isUpdating}
          className={`relative w-14 h-8 rounded-full transition ${power ? 'bg-green-500' : 'bg-gray-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${power ? 'translate-x-6' : ''
            }`}></span>
        </button>
      </div>

      {power && (
        <>
          {/* Speed Control */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                Fan Speed
              </label>
              <span className="text-lg font-bold text-gray-900">
                {speed === 0 ? 'Off' : `Level ${speed}`}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((speedLevel) => (
                <button
                  key={speedLevel}
                  onClick={() => updateCharacteristic({ speed: speedLevel })}
                  disabled={isUpdating}
                  className={`py-3 px-2 rounded-lg font-medium transition ${speed === speedLevel
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {speedLevel === 0 ? 'Off' : speedLevel}
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
                {timer === 0 ? 'Off' : `${timer} mins`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 30, 60, 120, 480].map((time) => (
                <button
                  key={time}
                  onClick={() => updateCharacteristic({ timer: time })}
                  disabled={isUpdating}
                  className={`py-2 px-2 rounded-lg text-sm font-medium transition ${timer === time
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {time === 0 ? 'Off' : `${time}m`}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Current Characteristics Display (for debugging) */}
      {device.characteristic && device.characteristic.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Current Settings:</p>
          <div className="grid grid-cols-2 gap-2">
            {device.characteristic.map((char, idx) => (
              <div key={idx} className="text-xs">
                <span className="text-blue-700 font-medium">{char.name}:</span>{' '}
                <span className="text-blue-900">{char.value}{char.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Light Control Component
function LightControl({ device, onUpdate, isUpdating }) {
  // Helper to get characteristic value
  const getCharValue = (charName, defaultValue = 0) => {
    const char = device.characteristic?.find(c => c.name === charName);
    return char ? parseInt(char.value) || defaultValue : defaultValue;
  };

  // Helper to check if device is powered on
  const isPoweredOn = () => {
    const powerChar = device.characteristic?.find(c => c.name === 'power');
    return powerChar ? (powerChar.value === '1' || powerChar.value === 'on' || powerChar.value === 'true') : false;
  };

  // Get current values from characteristic array
  const power = isPoweredOn();
  const brightness = getCharValue('brightness', 100);
  const colorTemp = getCharValue('colorTemp', 4000);

  // Helper to update characteristics
  const updateCharacteristic = (updates) => {
    const currentChars = device.characteristic || [];
    const charMap = new Map(currentChars.map(c => [c.name, c]));

    Object.entries(updates).forEach(([name, value]) => {
      charMap.set(name, {
        name,
        unit: getUnitForChar(name),
        value: String(value)
      });
    });

    const updatedCharacteristics = Array.from(charMap.values());

    onUpdate({
      ...device,
      characteristic: updatedCharacteristics
    });
  };

  const getUnitForChar = (charName) => {
    const unitMap = {
      'brightness': '%',
      'colorTemp': 'K',
      'power': '',
    };
    return unitMap[charName] || '';
  };

  return (
    <div className="space-y-6">
      {/* Power Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Power className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-900">Power</span>
        </div>
        <button
          onClick={() => updateCharacteristic({ power: power ? '0' : '1' })}
          disabled={isUpdating}
          className={`relative w-14 h-8 rounded-full transition ${power ? 'bg-yellow-500' : 'bg-gray-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${power ? 'translate-x-6' : ''
            }`}></span>
        </button>
      </div>

      {power && (
        <>
          {/* Brightness Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Brightness: {brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => updateCharacteristic({ brightness: parseInt(e.target.value) })}
              disabled={isUpdating}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
                onClick={() => updateCharacteristic({ brightness: 100, colorTemp: 5000 })}
                disabled={isUpdating}
                className={`py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Bright
              </button>
              <button
                onClick={() => updateCharacteristic({ brightness: 60, colorTemp: 4000 })}
                disabled={isUpdating}
                className={`py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Normal
              </button>
              <button
                onClick={() => updateCharacteristic({ brightness: 30, colorTemp: 2700 })}
                disabled={isUpdating}
                className={`py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Warm
              </button>
              <button
                onClick={() => updateCharacteristic({ brightness: 10, colorTemp: 2700 })}
                disabled={isUpdating}
                className={`py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Night
              </button>
            </div>
          </div>

          {/* Color Temperature (Optional) */}
          {colorTemp !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Temperature: {colorTemp}K
              </label>
              <input
                type="range"
                min="2200"
                max="6500"
                step="100"
                value={colorTemp}
                onChange={(e) => updateCharacteristic({ colorTemp: parseInt(e.target.value) })}
                disabled={isUpdating}
                className={`w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-200 to-blue-200 rounded-lg appearance-none cursor-pointer ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>🔥 Warm</span>
                <span>❄️ Cool</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Current Characteristics Display (for debugging) */}
      {device.characteristic && device.characteristic.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Current Settings:</p>
          <div className="grid grid-cols-2 gap-2">
            {device.characteristic.map((char, idx) => (
              <div key={idx} className="text-xs">
                <span className="text-blue-700 font-medium">{char.name}:</span>{' '}
                <span className="text-blue-900">{char.value}{char.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Lock Control Component
function LockControl({ device, onUpdate, isUpdating }) {
  // Helper to check if device is locked
  const isLocked = () => {
    const lockChar = device.characteristic?.find(c => c.name === 'locked');
    return lockChar ? (lockChar.value === '1' || lockChar.value === 'true' || lockChar.value === 'locked') : true;
  };

  const getCharValue = (charName, defaultValue) => {
    const char = device.characteristic?.find(c => c.name === charName);
    return char ? char.value : defaultValue;
  };

  const locked = isLocked();
  const autoLock = getCharValue('autoLock', 'true') === 'true';
  const autoLockDelay = parseInt(getCharValue('autoLockDelay', '30'));
  const lastAccess = getCharValue('lastAccess', 'Unknown');

  const updateCharacteristic = (updates) => {
    const currentChars = device.characteristic || [];
    const charMap = new Map(currentChars.map(c => [c.name, c]));

    Object.entries(updates).forEach(([name, value]) => {
      charMap.set(name, {
        name,
        unit: '',
        value: String(value)
      });
    });

    const updatedCharacteristics = Array.from(charMap.values());

    onUpdate({
      ...device,
      characteristic: updatedCharacteristics
    });
  };

  return (
    <div className="space-y-6">
      {/* Lock Status */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
        {locked ? (
          <Lock className="w-16 h-16 text-indigo-600 mx-auto mb-3" />
        ) : (
          <Unlock className="w-16 h-16 text-orange-600 mx-auto mb-3" />
        )}
        <p className="text-2xl font-bold text-gray-900 mb-2">
          {locked ? 'Locked' : 'Unlocked'}
        </p>
        <button
          onClick={() => updateCharacteristic({
            locked: locked ? '0' : '1',
            lastAccess: new Date().toLocaleString()
          })}
          disabled={isUpdating}
          className={`px-6 py-3 rounded-lg font-semibold transition ${locked
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {locked ? 'Unlock Door' : 'Lock Door'}
        </button>
      </div>

      {/* Auto Lock Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Timer className="w-5 h-5 text-gray-700" />
          <div>
            <p className="font-medium text-gray-900">Auto-Lock</p>
            <p className="text-sm text-gray-600">After {autoLockDelay}s</p>
          </div>
        </div>
        <button
          onClick={() => updateCharacteristic({ autoLock: autoLock ? '0' : '1' })}
          disabled={isUpdating}
          className={`relative w-14 h-8 rounded-full transition ${autoLock ? 'bg-indigo-500' : 'bg-gray-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${autoLock ? 'translate-x-6' : ''
            }`}></span>
        </button>
      </div>

      {/* Last Access */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">Last Access</p>
        <p className="text-gray-900">{lastAccess}</p>
      </div>

      {/* Current Characteristics Display */}
      {device.characteristic && device.characteristic.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Current Settings:</p>
          <div className="grid grid-cols-2 gap-2">
            {device.characteristic.map((char, idx) => (
              <div key={idx} className="text-xs">
                <span className="text-blue-700 font-medium">{char.name}:</span>{' '}
                <span className="text-blue-900">{char.value}{char.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
