import { useState } from 'react';
import DeviceTabs from './DeviceTabs';
import { Clock, Zap, Bell, Info, TrendingUp, Settings } from 'lucide-react';

export function FanConfig({ device }) {
  const [config, setConfig] = useState({
    // General
    maxRPM: 1200,
    powerLimit: 100, // watts

    // Automation
    autoTempThreshold: 28,
    autoTempSpeed: 4,
    autoHumidityThreshold: 70,
    autoHumiditySpeed: 4,
    linkToSensor: 'dht22-living01-001',

    // Schedule
    schedules: [
      { enabled: true, time: '22:00', action: 'off', days: [0, 1, 2, 3, 4, 5, 6] },
      { enabled: false, time: '06:00', action: 'speed-2', days: [1, 2, 3, 4, 5] }
    ],

    // Alerts
    alertRuntime: 8, // hours
    alertMaintenance: 720, // hours
    emailNotify: true,

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
        "General": <GeneralTab config={config} updateConfig={updateConfig} device={device} />,
        "Automation": <AutomationTab config={config} updateConfig={updateConfig} />,
        "Schedule": <ScheduleTab config={config} updateConfig={updateConfig} />,
        "Alerts": <AlertsTab config={config} updateConfig={updateConfig} />,
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Speed Level
        </label>
        <div className="grid grid-cols-6 gap-2">
          {[0, 1, 2, 3, 4, 5].map(speed => (
            <button
              key={speed}
              onClick={() => updateConfig('defaultSpeed', speed)}
              className={`py-3 rounded-lg font-medium transition ${config.defaultSpeed === speed
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {speed === 0 ? 'Off' : speed}
            </button>
          ))}
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
          <option value="preset">Use Default Speed</option>
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Setting startup to "Resume Last State" will remember the fan speed from before power loss.
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
          <label className="text-sm font-medium text-gray-700">
            Auto-Start on High Temperature
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Temperature Threshold (°C)</label>
            <input
              type="number"
              value={config.autoTempThreshold}
              onChange={(e) => updateConfig('autoTempThreshold', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Auto Speed Level</label>
            <select
              value={config.autoTempSpeed}
              onChange={(e) => updateConfig('autoTempSpeed', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>Level {s}</option>)}
            </select>
          </div>
        </div>
      </div>


      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Auto-Start on High Humidity
          </label>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.autoHumidityEnabled}
              onChange={(e) =>
                updateConfig('autoHumidityEnabled', e.target.checked)
              }
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full
              peer peer-checked:after:translate-x-full peer-checked:after:border-white
              after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
              peer-checked:bg-indigo-600">
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Humidity Threshold (%)
            </label>
            <input
              type="number"
              value={config.autoHumidityThreshold}
              onChange={(e) =>
                updateConfig('autoHumidityThreshold', Number(e.target.value))
              }
              disabled={!config.autoHumidityEnabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Auto Speed Level
            </label>
            <select
              value={config.autoHumiditySpeed}
              onChange={(e) =>
                updateConfig('autoHumiditySpeed', Number(e.target.value))
              }
              disabled={!config.autoHumidityEnabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>
                  Level {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Linked Sensor
        </label>
        <select
          value={config.linkToSensor}
          onChange={(e) => updateConfig('linkToSensor', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="dht22-living01-001">Living Room Climate (DHT22)</option>
        </select>
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
              <Clock className="w-4 h-4 text-gray-500" />
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
                <option value="speed-1">Speed 1</option>
                <option value="speed-2">Speed 2</option>
                <option value="speed-3">Speed 3</option>
                <option value="speed-4">Speed 4</option>
                <option value="speed-5">Speed 5</option>
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
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Runtime Alert (Continuous Operation)
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            value={config.alertRuntime}
            onChange={(e) => updateConfig('alertRuntime', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-600 text-sm">hours</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Alert when fan runs continuously for this duration</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maintenance Reminder
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            value={config.alertMaintenance}
            onChange={(e) => updateConfig('alertMaintenance', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-600 text-sm">hours</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Remind to clean/service after total runtime</p>
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
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
            <span className="text-sm text-gray-700">SMS Alerts (Critical Only)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function GeneralTab({ config, updateConfig, device }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum RPM
        </label>
        <input
          type="number"
          value={config.maxRPM}
          disabled
          onChange={(e) => updateConfig('maxRPM', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">Hardware limit for motor speed</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Power Limit (Watts)
        </label>
        <input
          type="number"
          value={config.powerLimit}
          disabled
          onChange={(e) => updateConfig('powerLimit', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
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
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-indigo-600">124h</p>
            <p className="text-xs text-gray-600 mt-1">Total Runtime</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">42</p>
            <p className="text-xs text-gray-600 mt-1">Times Activated</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">9.2</p>
            <p className="text-xs text-gray-600 mt-1">kWh Consumed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
