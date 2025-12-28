import { useState } from 'react';
import { StatCard } from './StatCard';
import { X, Power, ThermometerSun, Droplets, Wind, Lightbulb, Lock, Unlock, Activity, Clock, AlertTriangle, Fan as FanIcon, RotateCw, Timer, AlertCircle } from 'lucide-react';
import { useSensorStore } from '../services/socketService';

// Find DeviceControlModal component
export function DeviceControlModal({ device, sensor, onClose, onUpdate, onToggle }) {
  const [deviceState, setDeviceState] = useState(device);
  const [sensorState, setSensorState] = useState(sensor);
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
      // setDeviceState(deviceState);
      // setUpdateError(error.message || 'Failed to update device');
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };


  const handleToggle = async (updates) => { // Make it async
    setIsUpdating(true); // ADD THIS
    setUpdateError(null); // ADD THIS
    const newState = { ...deviceState, ...updates };

    // Optimistically update UI
    setDeviceState(newState);

    // ADD ERROR HANDLING
    try {
      if (onToggle) {
        await onToggle(newState._id, newState.status);
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
    switch (deviceState.deviceType) {
      case 'Fan':
        return <FanControl device={deviceState} onUpdate={handleUpdate} onToggle={handleToggle} isUpdating={isUpdating} />;
      case 'Light':
        return <LightControl device={deviceState} onUpdate={handleUpdate} onToggle={handleToggle} isUpdating={isUpdating} />;
      case 'lock':
        return <LockControl device={deviceState} onUpdate={handleUpdate} isUpdating={isUpdating} />;
      default:
        return <div className="text-gray-500 text-center py-8">No controls available</div>;
    }
  };

  const renderSensorState = () => {
    if (!sensorState) return null;

    switch (sensorState.name) {
      case 'DHT22_Sensor':
        return <DHT22Sensor sensor={sensorState} />;
      case 'mq2':
        return <MQ2Sensor sensor={sensorState} />;
      case 'BH1750_Light_Sensor':
        return <BH1750Sensor sensor={sensorState} />;
    }
  };

  const modalItem = deviceState || sensorState;
  if (!modalItem) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-4xl p-3 rounded-xl ${modalItem.status === 'online' ? 'bg-green-50' : 'bg-red-50'}`}>
              {modalItem.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{modalItem.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-600">{modalItem.room}</p>
                <span className={`flex items-center gap-1 text-sm ${modalItem.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${modalItem.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {modalItem.status}
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
          {deviceState?.energyUsage && (
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
          {device && renderDeviceControl()}

          {sensor && renderSensorState()}
        </div>
      </div>
    </div>
  );
}

// Fan Control Component
function FanControl({ device, onUpdate, onToggle, isUpdating }) {
  // 1. Determine Power State from 'status' field
  const isPowered = device.status === 'online';

  // 2. Get Characteristic Values
  const getCharValue = (charName, defaultValue = 0) => {
    const char = device.characteristic?.find(c => c.name === charName);
    return char ? parseInt(char.value) || 0 : defaultValue;
  };

  // Map JSON "Fan speed" to local variable
  const currentSpeed = getCharValue('Fan speed', 0);
  //const timer = getCharValue('timer', 0);

  // 3. Handle Power Toggle (Updates root 'status' field)
  const handlePowerToggle = () => {
    onToggle({
      ...device,
      status: isPowered ? 'offline' : 'online'
    });
  };

  // 4. Handle Characteristic Updates (Speed, Timer)
  const updateCharacteristic = (updates) => {
    const currentChars = device.characteristic || [];
    const charMap = new Map(currentChars.map(c => [c.name, c]));

    Object.entries(updates).forEach(([name, value]) => {
      const existingChar = charMap.get(name);
      charMap.set(name, {
        name,
        unit: existingChar?.unit || (name === 'Fan speed' ? 'level' : 'min'),
        value: String(value) // Ensuring value is a string prevents toString errors
      });
    });

    // FIX: Pass a NEW object with the NEW characteristic array
    onUpdate({
      ...device,
      characteristic: Array.from(charMap.values())
    });
  };

  return (
    <div className="space-y-6">
      {/* Power Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Power className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-900">Device Status</span>
        </div>
        <button
          onClick={handlePowerToggle}
          disabled={isUpdating}
          className={`relative w-14 h-8 rounded-full transition ${isPowered ? 'bg-green-500' : 'bg-gray-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isPowered ? 'translate-x-6' : ''
            }`}></span>
        </button>
      </div>

      {/* Controls (Only visible/active when Online) */}
      <div className={`transition-opacity duration-200 ${isPowered ? 'opacity-100' : 'opacity-50 pointer-events-none filter blur-[1px]'}`}>

        {/* Speed Control */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">
              Fan Speed
            </label>
            <span className="text-lg font-bold text-gray-900">
              {currentSpeed === 0 ? 'Zero' : `Level ${currentSpeed}`}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[70, 80, 90, 100].map((speedLevel) => (
              <button
                key={speedLevel}
                onClick={() => updateCharacteristic({ 'Fan speed': speedLevel })}
                disabled={isUpdating || !isPowered}
                className={`py-3 px-2 rounded-lg font-medium transition ${currentSpeed === speedLevel
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {speedLevel === 0 ? '0' : speedLevel}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Control */}
        {/*
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
                disabled={isUpdating || !isPowered}
                className={`py-2 px-2 rounded-lg text-sm font-medium transition ${
                  timer === time
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {time === 0 ? 'Off' : `${time}m`}
              </button>
            ))}
          </div>
        </div>
        */}
      </div>
    </div>
  );
}

// Light Control Component
function LightControl({ device, onUpdate, onToggle, isUpdating }) {
  // 1. Determine Power State from 'status' field
  const isPowered = device.status === 'online';

  // 2. Get Characteristic Values
  const getCharValue = (charName, defaultValue = 0) => {
    const char = device.characteristic?.find(c => c.name === charName);
    return char ? parseInt(char.value) || 0 : defaultValue;
  };

  // Map JSON "Light level" to local variable
  const currentLevel = getCharValue('Light level', 0);
  const colorTemp = getCharValue('colorTemp', 4000);
  const hasColorTemp = device.characteristic?.some(c => c.name === 'colorTemp');

  // 3. Handle Power Toggle (Updates root 'status' field)
  const handlePowerToggle = () => {
    onToggle({
      ...device,
      status: isPowered ? 'offline' : 'online'
    });
  };

  // 4. Handle Characteristic Updates
  const updateCharacteristic = (updates) => {
    const currentChars = device.characteristic || [];
    const charMap = new Map(currentChars.map(c => [c.name, c]));

    Object.entries(updates).forEach(([name, value]) => {
      const existingChar = charMap.get(name);
      charMap.set(name, {
        name,
        unit: existingChar?.unit || (name === 'Light level' ? 'level' : ''),
        value: String(value)
      });
    });

    // FIX: Pass a NEW object
    onUpdate({
      ...device,
      characteristic: Array.from(charMap.values())
    });
  };

  return (
    <div className="space-y-6">
      {/* Power Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Power className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-900">Device Status</span>
        </div>
        <button
          onClick={handlePowerToggle}
          disabled={isUpdating}
          className={`relative w-14 h-8 rounded-full transition ${isPowered ? 'bg-yellow-500' : 'bg-gray-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isPowered ? 'translate-x-6' : ''
            }`}></span>
        </button>
      </div>

      {/* Controls (Only visible/active when Online) */}
      <div className={`transition-opacity duration-200 ${isPowered ? 'opacity-100' : 'opacity-50 pointer-events-none filter blur-[1px]'}`}>

        {/* Brightness Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Brightness: {currentLevel}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentLevel}
            onChange={(e) => updateCharacteristic({ 'Light level': parseInt(e.target.value) })}
            disabled={isUpdating || !isPowered}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500`}

          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>255</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Night', val: 50 },
              { label: 'Dim', val: 100 },
              { label: 'Bright', val: 175 },
              { label: 'Max', val: 255 },

            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => updateCharacteristic({ 'Light level': preset.val })}
                disabled={isUpdating || !isPowered}
                className="py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Temperature (Conditional) */}
        {hasColorTemp && (
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
              disabled={isUpdating || !isPowered}
              className="w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-200 to-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>🔥 Warm</span>
              <span>❄️ Cool</span>
            </div>
          </div>
        )}
      </div>
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

    device.characteristic = updatedCharacteristics;
    onUpdate(device);
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

function DHT22Sensor({ sensor }) {
  const sensorItem = useSensorStore(s => s.sensors[sensor.name]);

  const temperature = sensorItem?.temperature;
  const humidity = sensorItem?.humidity;

  return (
    <div className="space-y-6">
      {/* Main Readings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-xl p-6 text-center">
          <ThermometerSun className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Temperature</p>
          <p className="text-4xl font-bold text-gray-900">
            {temperature}°C
          </p>
          <p className="text-xs text-gray-500 mt-2">Real-time reading</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <Droplets className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Humidity</p>
          <p className="text-4xl font-bold text-gray-900">
            {humidity}%
          </p>
          <p className="text-xs text-gray-500 mt-2">Real-time reading</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-xl ${temperature >= 18 && temperature <= 26
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
            }`}
        >
          <p className="text-sm font-medium text-gray-700">
            Temperature Status
          </p>
          <p
            className={`font-semibold ${temperature >= 18 && temperature <= 26
              ? "text-green-600"
              : "text-yellow-600"
              }`}
          >
            {temperature >= 18 && temperature <= 26
              ? "Optimal"
              : "Adjust Needed"}
          </p>
        </div>

        <div
          className={`p-4 rounded-xl ${humidity >= 40 && humidity <= 60
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
            }`}
        >
          <p className="text-sm font-medium text-gray-700">
            Humidity Status
          </p>
          <p
            className={`font-semibold ${humidity >= 40 && humidity <= 60
              ? "text-green-600"
              : "text-yellow-600"
              }`}
          >
            {humidity >= 40 && humidity <= 60
              ? "Optimal"
              : "Adjust Needed"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-sm text-gray-600">📡 Read-Only Sensor</p>
        <p className="text-xs text-gray-500 mt-1">
          DHT22 Temperature & Humidity Monitor
        </p>
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
function BH1750Sensor({ sensor }) {
  const sensorItem = useSensorStore(s => s.sensors[sensor.name]);
  const brightness = sensorItem?.brightness;

  const getConditionColor = () => {
    switch (brightness) {
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
            {sensorItem.brightness}
          </span>
          <span className="text-sm text-gray-600">
            lux
          </span>
        </div>
        <div className={`text-sm font-semibold uppercase ${colors.text}`}>
          {sensorItem.brightness}
        </div>
      </div>

      {/* Light Level Scale */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-3">Light Intensity Scale</p>
        <div className="relative w-full h-4 bg-gradient-to-r from-gray-800 via-yellow-300 to-orange-400 rounded-full">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg"
            style={{
              left: `${Math.min((sensorItem.brightness / 1000) * 100, 100)}%`,
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
