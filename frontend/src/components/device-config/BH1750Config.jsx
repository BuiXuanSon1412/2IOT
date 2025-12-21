import { useState } from 'react';
import DeviceTabs from './DeviceTabs';
import { Sun, Moon, CloudSun, Bell, Info, TrendingUp, Settings, Download, Lightbulb } from 'lucide-react';

export function BH1750Config({ device }) {
  const [config, setConfig] = useState({
    // Thresholds (Lux)
    darkThreshold: 10,
    dimThreshold: 100,
    brightThreshold: 500,
    veryBrightThreshold: 1000,

    // Calibration
    calibrationFactor: 1.0, // Multiplier (0.5 - 2.0)
    luxOffset: 0, // ±50 lux

    // Data Logging
    pollingIntervalSec: 10,
    dataRetentionDays: 30,
    exportFormat: 'csv',

    // Automation
    autoLightsEnabled: true,
    autoLightsThreshold: 100, // Turn on lights below this lux
    autoLightsBrightness: 75, // % brightness when auto-enabled
    duskDetectionEnabled: true,
    dawnDetectionEnabled: true,

    // Linked Devices
    linkedLights: [
      { id: 'light-living01-001', enabled: true, autoOn: true, autoOff: true },
    ],

    // Alerts
    extremeLightAlert: true,
    extremeLightThreshold: 2000, // Too bright - potential sun glare
    alertCooldown: 60, // minutes
    emailNotify: false,
    pushNotify: true,

    // Advanced
    measurementMode: 'continuous', // continuous, one-time
    resolution: 'high', // low (4 lux), high (1 lux)
  });

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{device.name}</h3>
          <p className="text-sm text-gray-500">{device.room} • {device.id}</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
          Save Changes
        </button>
      </div>

      <DeviceTabs tabs={{
        "General": <GeneralTab device={device} config={config} />,
        "Thresholds": <ThresholdsTab config={config} updateConfig={updateConfig} device={device} />,
        "Automation": <AutomationTab config={config} updateConfig={updateConfig} />,
        "Linked Devices": <LinkedDevicesTab config={config} updateConfig={updateConfig} />,
        "Calibration": <CalibrationTab config={config} updateConfig={updateConfig} device={device} />,
        "Alerts": <AlertsTab config={config} updateConfig={updateConfig} />,
        "History": <HistoryTab device={device} config={config} />
      }} />
    </div>
  );
}

// ============= TAB COMPONENTS =============

function GeneralTab({ device, config }) {
  const getCondition = () => {
    if (device.lightLevel >= config.veryBrightThreshold) return {
      name: 'Very Bright',
      color: 'orange',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      icon: '🔆',
      description: 'Direct sunlight or very bright artificial light'
    };
    if (device.lightLevel >= config.brightThreshold) return {
      name: 'Bright',
      color: 'yellow',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-600',
      icon: '☀️',
      description: 'Well-lit environment, good for activities'
    };
    if (device.lightLevel >= config.dimThreshold) return {
      name: 'Dim',
      color: 'blue',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      icon: '🌥️',
      description: 'Moderate lighting, may need supplemental light'
    };
    return {
      name: 'Dark',
      color: 'gray',
      bg: 'bg-gray-700',
      border: 'border-gray-800',
      text: 'text-white',
      icon: '🌙',
      description: 'Low light conditions, artificial lighting needed'
    };
  };

  const condition = getCondition();

  return (
    <div className="space-y-6">
      {/* Main Light Level Display */}
      <div className={`${condition.bg} border-2 ${condition.border} rounded-xl p-8 text-center`}>
        <div className="text-6xl mb-4">{condition.icon}</div>
        <p className={`text-3xl font-bold ${condition.text} mb-2`}>
          {condition.name}
        </p>
        <div className="text-5xl font-bold text-gray-900 mb-1">
          {device.lightLevel} <span className="text-2xl text-gray-600">lux</span>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          {condition.description}
        </p>
      </div>

      {/* Light Level Scale */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Light Intensity</span>
          <span className="font-semibold">{device.lightLevel} lux</span>
        </div>
        <div className="relative w-full h-8 bg-gradient-to-r from-gray-800 via-blue-300 via-yellow-300 to-orange-400 rounded-lg">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-white border-2 border-gray-900 shadow-lg"
            style={{
              left: `${Math.min((device.lightLevel / 2000) * 100, 100)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              {device.lightLevel} lux
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 (Dark)</span>
          <span>500</span>
          <span>1000</span>
          <span>2000+ (Very Bright)</span>
        </div>
      </div>

      {/* Light Conditions Reference */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 text-white rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Moon className="w-4 h-4" />
            <p className="text-xs font-semibold">Dark (0-10 lux)</p>
          </div>
          <p className="text-xs opacity-80">Night time, no light sources</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CloudSun className="w-4 h-4 text-blue-700" />
            <p className="text-xs font-semibold text-blue-900">Dim (10-100 lux)</p>
          </div>
          <p className="text-xs text-blue-700">Twilight, distant lighting</p>
        </div>
        <div className="bg-yellow-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-yellow-700" />
            <p className="text-xs font-semibold text-yellow-900">Bright (100-500 lux)</p>
          </div>
          <p className="text-xs text-yellow-700">Indoor lighting, office</p>
        </div>
        <div className="bg-orange-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-orange-700" />
            <p className="text-xs font-semibold text-orange-900">Very Bright (500+ lux)</p>
          </div>
          <p className="text-xs text-orange-700">Daylight, direct sun</p>
        </div>
      </div>

      {/* Sensor Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          📡 <strong>Sensor Type:</strong> BH1750 Digital Ambient Light Sensor - High accuracy 16-bit light intensity measurement
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Resolution</p>
          <p className="text-lg font-bold text-gray-900">{config.resolution === 'high' ? '1' : '4'} lux</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Range</p>
          <p className="text-lg font-bold text-gray-900">1-65535 lux</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Accuracy</p>
          <p className="text-lg font-bold text-gray-900">±20%</p>
        </div>
      </div>
    </div>
  );
}

function ThresholdsTab({ config, updateConfig, device }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Define light level thresholds to categorize ambient lighting conditions and trigger automations.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dark Threshold
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={config.darkThreshold}
              onChange={(e) => updateConfig('darkThreshold', Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-600">lux</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Below this = Dark (🌙)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dim Threshold
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={config.dimThreshold}
              onChange={(e) => updateConfig('dimThreshold', Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-600">lux</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Below this = Dim (🌥️)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bright Threshold
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={config.brightThreshold}
              onChange={(e) => updateConfig('brightThreshold', Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-600">lux</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Below this = Bright (☀️)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Very Bright Threshold
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={config.veryBrightThreshold}
              onChange={(e) => updateConfig('veryBrightThreshold', Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-600">lux</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Above this = Very Bright (🔆)</p>
        </div>
      </div>

      {/* Visual Threshold Display */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Threshold Visualization</h4>
        <div className="relative h-32 bg-gradient-to-r from-gray-800 via-blue-200 via-yellow-200 to-orange-300 rounded-lg p-4">
          {/* Current level indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
            style={{ left: `${Math.min((device.lightLevel / 2000) * 100, 100)}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-gray-800 px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg">
              Current: {device.lightLevel} lux
            </div>
          </div>

          {/* Threshold markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-600"
            style={{ left: `${(config.darkThreshold / 2000) * 100}%` }}
          >
            <span className="absolute top-full mt-1 -translate-x-1/2 text-xs font-semibold text-gray-700">
              Dark
            </span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-600"
            style={{ left: `${(config.dimThreshold / 2000) * 100}%` }}
          >
            <span className="absolute top-full mt-1 -translate-x-1/2 text-xs font-semibold text-blue-700">
              Dim
            </span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-600"
            style={{ left: `${(config.brightThreshold / 2000) * 100}%` }}
          >
            <span className="absolute top-full mt-1 -translate-x-1/2 text-xs font-semibold text-yellow-700">
              Bright
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            updateConfig('darkThreshold', 10);
            updateConfig('dimThreshold', 100);
            updateConfig('brightThreshold', 500);
            updateConfig('veryBrightThreshold', 1000);
          }}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Common Settings:</strong> Office (300-500 lux), Living room (100-300 lux), Bedroom (50-150 lux)
        </p>
      </div>
    </div>
  );
}

function AutomationTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Automatic Lighting Control
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoLightsEnabled}
              onChange={(e) => updateConfig('autoLightsEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Automatically control lights based on ambient light levels</p>
      </div>

      {config.autoLightsEnabled && (
        <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turn On Lights Below
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={config.autoLightsThreshold}
                onChange={(e) => updateConfig('autoLightsThreshold', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-600">lux</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Lights activate when ambient light drops below this level</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-On Brightness: {config.autoLightsBrightness}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.autoLightsBrightness}
              onChange={(e) => updateConfig('autoLightsBrightness', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Dusk Detection
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.duskDetectionEnabled}
              onChange={(e) => updateConfig('duskDetectionEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Detect when sun is setting and trigger evening routines</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Dawn Detection
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.dawnDetectionEnabled}
              onChange={(e) => updateConfig('dawnDetectionEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Detect sunrise and trigger morning routines</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800 mb-2">
          <strong>Active Automation Rules:</strong>
        </p>
        <ul className="text-xs text-green-700 space-y-1">
          {config.autoLightsEnabled && (
            <li>• Turn on lights at {config.autoLightsBrightness}% when below {config.autoLightsThreshold} lux</li>
          )}
          {config.duskDetectionEnabled && (
            <li>• Activate evening scene when dusk is detected</li>
          )}
          {config.dawnDetectionEnabled && (
            <li>• Deactivate night mode when dawn is detected</li>
          )}
          {!config.autoLightsEnabled && !config.duskDetectionEnabled && !config.dawnDetectionEnabled && (
            <li className="text-gray-500">No automation rules active</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function LinkedDevicesTab({ config, updateConfig }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Controlled Lights</h4>
          <p className="text-xs text-gray-500 mt-1">Lights that respond to ambient light changes</p>
        </div>
        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition">
          + Link Device
        </button>
      </div>

      {config.linkedLights.map((light, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">
                {light.id === 'light-living01-001' ? 'Living Room Light' :
                  light.id === 'light-bedroom01-001' ? 'Bedroom Light' :
                    'Unknown Light'}
              </span>
            </div>
            <button className="text-red-500 text-sm hover:text-red-700">Remove</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={light.autoOn}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">Auto Turn On</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={light.autoOff}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">Auto Turn Off</span>
            </label>
          </div>

          <div className="bg-indigo-50 rounded p-2 text-xs text-indigo-700">
            {light.autoOn && light.autoOff && '↔️ Full automation enabled'}
            {light.autoOn && !light.autoOff && '→ Auto turn on only'}
            {!light.autoOn && light.autoOff && '← Auto turn off only'}
            {!light.autoOn && !light.autoOff && '⏸️ Manual control only'}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Link multiple lights to create synchronized ambient lighting throughout your home.
        </p>
      </div>
    </div>
  );
}

function CalibrationTab({ config, updateConfig, device }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          ⚙️ Calibration adjusts sensor readings to match actual light conditions. Useful if sensor is behind glass or has obstruction.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Calibration Factor: {config.calibrationFactor}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={config.calibrationFactor}
          onChange={(e) => updateConfig('calibrationFactor', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5x (Darker)</span>
          <span>1.0x (Default)</span>
          <span>2.0x (Brighter)</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Multiplies all sensor readings by this factor</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Lux Offset: {config.luxOffset > 0 ? '+' : ''}{config.luxOffset} lux
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="5"
          value={config.luxOffset}
          onChange={(e) => updateConfig('luxOffset', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-50 lux</span>
          <span>0 lux</span>
          <span>+50 lux</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Adds or subtracts this value from readings</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Calibration Preview</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Raw Reading</p>
            <p className="text-3xl font-bold text-gray-900">{device.lightLevel}</p>
            <p className="text-xs text-gray-500 mt-1">lux</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
            <p className="text-xs text-indigo-600 mb-1">Calibrated Reading</p>
            <p className="text-3xl font-bold text-indigo-600">
              {Math.round((device.lightLevel * config.calibrationFactor) + config.luxOffset)}
            </p>
            <p className="text-xs text-indigo-500 mt-1">lux</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            updateConfig('calibrationFactor', 1.0);
            updateConfig('luxOffset', 0);
          }}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          Reset Calibration
        </button>
        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
          Apply & Test
        </button>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ Test calibration at different times of day to ensure accuracy. Compare with a calibrated light meter if available.
        </p>
      </div>
    </div>
  );
}
function AlertsTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Extreme Light Level Alerts
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.extremeLightAlert}
              onChange={(e) => updateConfig('extremeLightAlert', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Alert when light levels are extremely high (potential sun glare or sensor malfunction)</p>
      </div>
      {config.extremeLightAlert && (
        <div className="pl-4 border-l-2 border-indigo-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extreme Light Threshold
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={config.extremeLightThreshold}
              onChange={(e) => updateConfig('extremeLightThreshold', Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-600">lux</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Alert when light exceeds this level</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Cooldown Period
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={config.alertCooldown}
            onChange={(e) => updateConfig('alertCooldown', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-600">minutes</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Minimum time between repeated alerts</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Notification Methods
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input
              type="checkbox"
              checked={config.pushNotify}
              onChange={(e) => updateConfig('pushNotify', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-500">Instant notifications on your device</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input
              type="checkbox"
              checked={config.emailNotify}
              onChange={(e) => updateConfig('emailNotify', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Detailed alert emails with sensor data</p>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 Light sensor alerts are typically informational. Critical automations should be based on thresholds, not alerts.
        </p>
      </div>
    </div>
  );
}
function HistoryTab({ device, config }) {
  // Mock 24-hour data
  const mockData = [
    { time: '00:00', lux: 5 },
    { time: '04:00', lux: 2 },
    { time: '08:00', lux: 450 },
    { time: '12:00', lux: 1200 },
    { time: '16:00', lux: 800 },
    { time: '20:00', lux: 120 },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">24-Hour Light Trend</h4>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs hover:bg-indigo-200 transition">
            24h
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition">
            7d
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition">
            30d
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-end justify-between gap-2">
        {mockData.map((point, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-yellow-400 to-orange-300 rounded-t hover:opacity-80 cursor-pointer transition"
              style={{ height: `${(point.lux / 1500) * 200}px` }}
              title={`${point.lux} lux`}
            ></div>
            <span className="text-[10px] text-gray-600 mt-2">{point.time}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistics (24 Hours)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Average Light</p>
            <p className="text-2xl font-bold text-yellow-600">430 lux</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Peak Light</p>
            <p className="text-2xl font-bold text-orange-600">1200 lux</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Hours of Daylight</p>
            <p className="text-2xl font-bold text-blue-600">12.5h</p>
          </div>
          <div className="bg-gray-700 text-white rounded-lg p-3">
            <p className="text-xs opacity-80">Hours of Night</p>
            <p className="text-2xl font-bold">11.5h</p>
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
        <Download className="w-4 h-4" />
        Export Data ({config.exportFormat.toUpperCase()})
      </button>

      <div className="bg-indigo-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-900 mb-2">Insights</h5>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Sunrise detected at ~06:45</li>
          <li>• Peak light at 12:15 (midday)</li>
          <li>• Sunset detected at ~19:30</li>
          <li>• Optimal time for natural lighting: 08:00-18:00</li>
        </ul>
      </div>
    </div>
  );
}
