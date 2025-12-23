import { useState } from 'react';
import DeviceTabs from './DeviceTabs';
import { Palette, Zap, Bell, Info, TrendingUp, Sun, Moon, Sunrise } from 'lucide-react';

export function LightConfig({ device }) {
  const [config, setConfig] = useState({
    // Basic
    defaultBrightness: device.brightness || 75,
    colorTemperature: 4000, // Kelvin
    startupMode: 'last', // last, off, preset

    // Scenes
    scenes: [
      { name: 'Reading', brightness: 100, temp: 5000, icon: '📖' },
      { name: 'Relax', brightness: 40, temp: 2700, icon: '🛋️' },
      { name: 'Movie', brightness: 10, temp: 2700, icon: '🎬' },
      { name: 'Night', brightness: 5, temp: 2200, icon: '🌙' },
    ],

    // Automation
    autoOnAtDusk: true,
    autoOffAtDawn: true,
    motionSensorEnabled: false,
    motionTimeout: 5, // minutes
    linkToLightSensor: 'bh1750-living01-001',
    autoAdjustThreshold: 100, // lux

    // Schedule
    schedules: [
      { enabled: true, time: '18:30', action: 'on-75', days: [0, 1, 2, 3, 4, 5, 6] },
      { enabled: true, time: '23:00', action: 'off', days: [0, 1, 2, 3, 4, 5, 6] }
    ],

    // Alerts
    bulbLifespan: 10000, // hours
    currentUsage: 2450, // hours
    overheatingAlert: true,
    emailNotify: true,

    // Advanced
    powerLimitWatt: 12,
    dimCurve: 'linear', // linear, logarithmic, exponential
    fadeTime: 1, // seconds
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
        "Basic Settings": <BasicTab config={config} updateConfig={updateConfig} />,
        "Scenes": <ScenesTab config={config} updateConfig={updateConfig} />,
        "Automation": <AutomationTab config={config} updateConfig={updateConfig} />,
        "Schedule": <ScheduleTab config={config} updateConfig={updateConfig} />,
        "Alerts": <AlertsTab config={config} updateConfig={updateConfig} />,
        "Advanced": <AdvancedTab config={config} updateConfig={updateConfig} device={device} />,
        "History": <HistoryTab device={device} />
      }} />
    </div>
  );
}

// ============= TAB COMPONENTS =============

function BasicTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Default Brightness: {config.defaultBrightness}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={config.defaultBrightness}
          onChange={(e) => updateConfig('defaultBrightness', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color Temperature: {config.colorTemperature}K
        </label>
        <input
          type="range"
          min="2200"
          max="6500"
          step="100"
          value={config.colorTemperature}
          onChange={(e) => updateConfig('colorTemperature', parseInt(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-200 to-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>🔥 Warm</span>
          <span>☀️ Neutral</span>
          <span>❄️ Cool</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Startup Behavior
        </label>
        <select
          value={config.startupMode}
          onChange={(e) => updateConfig('startupMode', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="last">Resume Last State</option>
          <option value="off">Always Start Off</option>
          <option value="preset">Use Default Settings</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => updateConfig('defaultBrightness', 100)}
          className="py-2 px-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-sm font-medium transition"
        >
          💡 Max
        </button>
        <button
          onClick={() => updateConfig('defaultBrightness', 75)}
          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
        >
          Bright
        </button>
        <button
          onClick={() => updateConfig('defaultBrightness', 40)}
          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
        >
          Dim
        </button>
        <button
          onClick={() => updateConfig('defaultBrightness', 10)}
          className="py-2 px-3 bg-gray-800 text-white hover:bg-gray-900 rounded-lg text-sm font-medium transition"
        >
          🌙 Night
        </button>
      </div>
    </div>
  );
}

function ScenesTab({ config, updateConfig }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Lighting Scenes</h4>
        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition">
          + Create Scene
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Save your favorite lighting configurations for quick access
      </p>

      <div className="grid grid-cols-2 gap-3">
        {config.scenes.map((scene, idx) => (
          <div
            key={idx}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-400 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl">{scene.icon}</div>
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition">
                ✕
              </button>
            </div>
            <h5 className="font-semibold text-gray-900 mb-1">{scene.name}</h5>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Brightness: {scene.brightness}%</p>
              <p>Temperature: {scene.temp}K</p>
            </div>
            <button className="w-full mt-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition">
              Apply Scene
            </button>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Pro Tip:</strong> Create scenes for different activities like working, relaxing, or entertaining guests.
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
            <Sunrise className="w-4 h-4" />
            Auto On at Dusk
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoOnAtDusk}
              onChange={(e) => updateConfig('autoOnAtDusk', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Automatically turn on when sun sets</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Auto Off at Dawn
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoOffAtDawn}
              onChange={(e) => updateConfig('autoOffAtDawn', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Automatically turn off when sun rises</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Motion Sensor Control
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.motionSensorEnabled}
              onChange={(e) => updateConfig('motionSensorEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        {config.motionSensorEnabled && (
          <div>
            <label className="block text-xs text-gray-600 mb-1">Auto-off after no motion (minutes)</label>
            <input
              type="number"
              value={config.motionTimeout}
              onChange={(e) => updateConfig('motionTimeout', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ambient Light Adjustment
        </label>
        <select
          value={config.linkToLightSensor}
          onChange={(e) => updateConfig('linkToLightSensor', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
        >
          <option value="bh1750-living01-001">Living Room Light Sensor (BH1750)</option>
          <option value="bh1750-bedroom01-001">Bedroom Light Sensor (BH1750)</option>
          <option value="none">No Sensor Link</option>
        </select>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Turn on when ambient light drops below (lux)</label>
          <input
            type="number"
            value={config.autoAdjustThreshold}
            onChange={(e) => updateConfig('autoAdjustThreshold', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          ✅ Smart automation will adjust lighting based on time and ambient conditions
        </p>
      </div>
    </div>
  );
}

function ScheduleTab({ config, updateConfig }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Scheduled Actions</h4>
        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition">
          + Add Schedule
        </button>
      </div>

      {config.schedules.map((schedule, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={schedule.enabled} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-sm text-gray-700">Schedule {idx + 1}</span>
            </div>
            <button className="text-red-500 text-sm hover:text-red-700">Remove</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Time</label>
              <input type="time" value={schedule.time} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Action</label>
              <select value={schedule.action} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="off">Turn Off</option>
                <option value="on-25">Turn On (25%)</option>
                <option value="on-50">Turn On (50%)</option>
                <option value="on-75">Turn On (75%)</option>
                <option value="on-100">Turn On (100%)</option>
                <option value="scene-reading">Scene: Reading</option>
                <option value="scene-relax">Scene: Relax</option>
              </select>
            </div>
          </div>

          <div className="flex gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <button
                key={i}
                className={`flex-1 py-1.5 rounded text-xs font-medium transition ${schedule.days.includes(i)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsTab({ config, updateConfig }) {
  const lifespanPercent = (config.currentUsage / config.bulbLifespan) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            Bulb Lifespan
          </label>
          <span className="text-sm font-semibold text-gray-900">
            {config.currentUsage}h / {config.bulbLifespan}h
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${lifespanPercent > 90 ? 'bg-red-500' :
                lifespanPercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            style={{ width: `${Math.min(lifespanPercent, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {lifespanPercent > 90 ? '⚠️ Replace bulb soon' :
            lifespanPercent > 70 ? '⚡ Bulb nearing end of life' :
              '✅ Bulb in good condition'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Bulb Lifespan (hours)
        </label>
        <input
          type="number"
          value={config.bulbLifespan}
          onChange={(e) => updateConfig('bulbLifespan', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">Alert when bulb reaches 90% of lifespan</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Overheating Alert
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.overheatingAlert}
              onChange={(e) => updateConfig('overheatingAlert', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Notify if light temperature exceeds safe limits</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Notification Methods
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={config.emailNotify} className="w-4 h-4 text-indigo-600 rounded" />
            <span className="text-sm text-gray-700">Email Notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
            <span className="text-sm text-gray-700">Push Notifications</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function AdvancedTab({ config, updateConfig, device }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Power Limit (Watts)
        </label>
        <input
          type="number"
          value={config.powerLimitWatt}
          onChange={(e) => updateConfig('powerLimitWatt', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">Maximum power consumption allowed</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dimming Curve
        </label>
        <select
          value={config.dimCurve}
          onChange={(e) => updateConfig('dimCurve', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="linear">Linear (Default)</option>
          <option value="logarithmic">Logarithmic (Smoother low end)</option>
          <option value="exponential">Exponential (Smoother high end)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">How brightness changes across the dimming range</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fade Time (seconds)
        </label>
        <input
          type="number"
          min="0"
          max="10"
          step="0.5"
          value={config.fadeTime}
          onChange={(e) => updateConfig('fadeTime', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">Transition time when turning on/off</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Device Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Device ID:</span>
            <p className="font-mono text-gray-900">{device.id}</p>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <p className="font-medium text-green-600">{device.status}</p>
          </div>
          <div>
            <span className="text-gray-600">Energy Usage:</span>
            <p className="font-medium text-gray-900">{device.energyUsage}</p>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <p className="font-medium text-gray-900">{device.lastUpdated}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Warning:</strong> Changing advanced settings may affect device performance and lifespan.
        </p>
      </div>
    </div>
  );
}

function HistoryTab({ device }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Activity Log</h4>
        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
          Export CSV
        </button>
      </div>

      <div className="space-y-2">
        {device.logs && device.logs.length > 0 ? (
          device.logs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{log}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity logs available</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Usage Statistics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">2,450h</p>
            <p className="text-xs text-gray-600 mt-1">Total Runtime</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">186</p>
            <p className="text-xs text-gray-600 mt-1">Times Activated</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">29.4</p>
            <p className="text-xs text-gray-600 mt-1">kWh Consumed</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-900 mb-2">Energy Insights</h5>
        <div className="space-y-1 text-sm text-gray-700">
          <p>• Average daily usage: 4.2 hours</p>
          <p>• Most active time: 18:00 - 23:00</p>
          <p>• Estimated monthly cost: $3.52</p>
        </div>
      </div>
    </div>
  );
}
