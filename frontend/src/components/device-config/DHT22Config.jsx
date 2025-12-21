import { useState } from 'react';
import DeviceTabs from './DeviceTabs';
import { Thermometer, Droplets, Bell, Info, TrendingUp, Settings, Download } from 'lucide-react';

export function DHT22Config({ device }) {
  const [config, setConfig] = useState({
    // Thresholds
    tempMin: 18,
    tempMax: 28,
    tempCriticalMin: 10,
    tempCriticalMax: 35,
    humidityMin: 30,
    humidityMax: 70,
    humidityCriticalMin: 20,
    humidityCriticalMax: 80,

    // Calibration
    tempOffset: 0, // ±5°C
    humidityOffset: 0, // ±10%

    // Data Logging
    pollingIntervalSec: 5,
    dataRetentionDays: 30,
    exportFormat: 'csv',

    // Alerts
    enableTempAlerts: true,
    enableHumidityAlerts: true,
    alertCooldown: 30, // minutes
    emailNotify: true,
    pushNotify: true,

    // Automation Links
    linkedDevices: [
      { id: 'fan-living01-001', condition: 'temp > 28', action: 'turn on speed 4' },
    ],
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
        "Current Readings": <ReadingsTab device={device} />,
        "Thresholds": <ThresholdsTab config={config} updateConfig={updateConfig} device={device} />,
        /*"Calibration": <CalibrationTab config={config} updateConfig={updateConfig} device={device} />,*/
        "Data Logging": <DataLoggingTab config={config} updateConfig={updateConfig} />,
        "Alerts": <AlertsTab config={config} updateConfig={updateConfig} />,
        /*"Linked Devices": <LinkedDevicesTab config={config} updateConfig={updateConfig} />,*/
        "History": <HistoryTab device={device} config={config} />
      }} />
    </div>
  );
}

// ============= TAB COMPONENTS =============

function ReadingsTab({ device }) {
  const tempStatus = device.temperature >= 18 && device.temperature <= 26 ? 'optimal' : 'warning';
  const humidityStatus = device.humidity >= 40 && device.humidity <= 60 ? 'optimal' : 'warning';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-xl p-6 text-center ${tempStatus === 'optimal' ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
          }`}>
          <Thermometer className={`w-12 h-12 mx-auto mb-3 ${tempStatus === 'optimal' ? 'text-green-600' : 'text-yellow-600'
            }`} />
          <p className="text-sm text-gray-600 mb-1">Temperature</p>
          <p className="text-5xl font-bold text-gray-900">{device.temperature}°C</p>
          <p className={`text-sm font-semibold mt-2 ${tempStatus === 'optimal' ? 'text-green-600' : 'text-yellow-600'
            }`}>
            {tempStatus === 'optimal' ? '✓ Optimal' : '⚠ Adjust Needed'}
          </p>
        </div>

        <div className={`rounded-xl p-6 text-center ${humidityStatus === 'optimal' ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
          }`}>
          <Droplets className={`w-12 h-12 mx-auto mb-3 ${humidityStatus === 'optimal' ? 'text-blue-600' : 'text-yellow-600'
            }`} />
          <p className="text-sm text-gray-600 mb-1">Humidity</p>
          <p className="text-5xl font-bold text-gray-900">{device.humidity}%</p>
          <p className={`text-sm font-semibold mt-2 ${humidityStatus === 'optimal' ? 'text-blue-600' : 'text-yellow-600'
            }`}>
            {humidityStatus === 'optimal' ? '✓ Optimal' : '⚠ Adjust Needed'}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Comfort Ranges</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Temperature</span>
              <span className="font-medium">18-26°C Optimal</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
              <div className="absolute h-2 bg-green-500 rounded-full" style={{ left: '36%', width: '32%' }}></div>
              <div
                className="absolute w-3 h-3 bg-orange-500 border-2 border-white rounded-full shadow -translate-x-1/2 -translate-y-[2px]"
                style={{ left: `${((device.temperature - 10) / 30) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10°C</span>
              <span>40°C</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Humidity</span>
              <span className="font-medium">40-60% Optimal</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
              <div className="absolute h-2 bg-blue-500 rounded-full" style={{ left: '40%', width: '20%' }}></div>
              <div
                className="absolute w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow -translate-x-1/2 -translate-y-[2px]"
                style={{ left: `${device.humidity}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-600">Heat Index</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {(device.temperature + ((device.humidity / 100) * 2)).toFixed(1)}°C
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-600">Dew Point</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {(device.temperature - ((100 - device.humidity) / 5)).toFixed(1)}°C
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          📡 <strong>Sensor Type:</strong> DHT22 (AM2302) - High accuracy digital temperature and humidity sensor
        </p>
      </div>
    </div>
  );
}

function ThresholdsTab({ config, updateConfig, device }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Temperature Thresholds</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Minimum (Warning)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.tempMin}
                onChange={(e) => updateConfig('tempMin', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-600">°C</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Maximum (Warning)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.tempMax}
                onChange={(e) => updateConfig('tempMax', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-600">°C</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Minimum (Critical)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.tempCriticalMin}
                onChange={(e) => updateConfig('tempCriticalMin', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-red-300 rounded-lg"
              />
              <span className="text-gray-600">°C</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Maximum (Critical)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.tempCriticalMax}
                onChange={(e) => updateConfig('tempCriticalMax', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-red-300 rounded-lg"
              />
              <span className="text-gray-600">°C</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-100 via-green-100 via-yellow-100 to-red-100 h-6 rounded-lg relative">
          <div
            className="absolute top-0 bottom-0 w-1 bg-gray-800"
            style={{ left: `${((device.temperature - 10) / 30) * 100}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold bg-white px-2 py-0.5 rounded shadow">
              {device.temperature}°C
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Critical Low</span>
          <span>Warning</span>
          <span>Optimal</span>
          <span>Warning</span>
          <span>Critical High</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Humidity Thresholds</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Minimum (Warning)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.humidityMin}
                onChange={(e) => updateConfig('humidityMin', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Maximum (Warning)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.humidityMax}
                onChange={(e) => updateConfig('humidityMax', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Minimum (Critical)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.humidityCriticalMin}
                onChange={(e) => updateConfig('humidityCriticalMin', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-red-300 rounded-lg"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Maximum (Critical)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.humidityCriticalMax}
                onChange={(e) => updateConfig('humidityCriticalMax', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-red-300 rounded-lg"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-100 via-green-100 to-blue-100 h-6 rounded-lg relative">
          <div
            className="absolute top-0 bottom-0 w-1 bg-gray-800"
            style={{ left: `${device.humidity}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold bg-white px-2 py-0.5 rounded shadow">
              {device.humidity}%
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Critical Low</span>
          <span>Warning</span>
          <span>Optimal</span>
          <span>Warning</span>
          <span>Critical High</span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Warning alerts notify you, while critical alerts can trigger emergency automation.
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
          ⚙️ Calibration allows you to adjust sensor readings if you notice consistent offset from a reference device.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Temperature Offset: {config.tempOffset > 0 ? '+' : ''}{config.tempOffset}°C
        </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.1"
          value={config.tempOffset}
          onChange={(e) => updateConfig('tempOffset', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-5°C</span>
          <span>0°C</span>
          <span>+5°C</span>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Raw Reading:</span>
            <span className="font-medium">{device.temperature}°C</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Calibrated Reading:</span>
            <span className="font-bold text-orange-600">
              {(device.temperature + config.tempOffset).toFixed(1)}°C
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Humidity Offset: {config.humidityOffset > 0 ? '+' : ''}{config.humidityOffset}%
        </label>
        <input
          type="range"
          min="-10"
          max="10"
          step="1"
          value={config.humidityOffset}
          onChange={(e) => updateConfig('humidityOffset', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-10%</span>
          <span>0%</span>
          <span>+10%</span>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Raw Reading:</span>
            <span className="font-medium">{device.humidity}%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Calibrated Reading:</span>
            <span className="font-bold text-blue-600">
              {device.humidity + config.humidityOffset}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
          Reset to Factory
        </button>
        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
          Apply Calibration
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ Only adjust calibration if you have a verified reference device. Incorrect calibration can lead to false alerts.
        </p>
      </div>
    </div>
  );
}

function DataLoggingTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Polling Interval
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={config.pollingIntervalSec}
            onChange={(e) => updateConfig('pollingIntervalSec', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-600">seconds</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">How often to collect sensor data (1-60 seconds)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Retention Period
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={config.dataRetentionDays}
            onChange={(e) => updateConfig('dataRetentionDays', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-600">days</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">How long to store historical data</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Export Format
        </label>
        <select
          value={config.exportFormat}
          onChange={(e) => updateConfig('exportFormat', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="csv">CSV (Comma Separated)</option>
          <option value="json">JSON (Structured Data)</option>
          <option value="xlsx">Excel (XLSX)</option>
        </select>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Storage Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Data Points Stored:</span>
            <span className="font-medium">8,640</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Storage Used:</span>
            <span className="font-medium">124 KB</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Oldest Record:</span>
            <span className="font-medium">30 days ago</span>
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
        <Download className="w-4 h-4" />
        Export Historical Data
      </button>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          💾 Data is automatically backed up to cloud storage every 24 hours
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
            Temperature Alerts
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableTempAlerts}
              onChange={(e) => updateConfig('enableTempAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Alert when temperature exceeds configured thresholds</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Humidity Alerts
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableHumidityAlerts}
              onChange={(e) => updateConfig('enableHumidityAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Alert when humidity exceeds configured thresholds</p>
      </div>

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
        <p className="text-xs text-gray-500 mt-1">Minimum time between repeated alerts for the same condition</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Notification Methods
        </label>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts via email</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.emailNotify}
              onChange={(e) => updateConfig('emailNotify', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Instant notifications on your device</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.pushNotify}
              onChange={(e) => updateConfig('pushNotify', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">SMS Alerts</p>
                <p className="text-xs text-gray-500">Critical alerts only</p>
              </div>
            </div>
            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
          </label>
        </div>
      </div>
    </div>
  );
}

function LinkedDevicesTab({ config, updateConfig }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Automation Rules</h4>
          <p className="text-xs text-gray-500 mt-1">Trigger actions on other devices based on sensor readings</p>
        </div>
        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition">
          + Add Rule
        </button>
      </div>

      {config.linkedDevices.map((link, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Rule {idx + 1}</span>
            <button className="text-red-500 text-sm hover:text-red-700">Remove</button>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">When</label>
            <input
              type="text"
              value={link.condition}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g., temp > 28 or humidity < 30"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Control Device</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="fan-living01-001">Living Room Fan</option>
              <option value="fan-bedroom01-001">Bedroom Fan</option>
              <option value="light-living01-001">Living Room Light</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Action</label>
            <input
              type="text"
              value={link.action}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g., turn on, set speed 4"
            />
          </div>
        </div>
      ))}

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm text-indigo-800 mb-2">
          <strong>Example Rules:</strong>
        </p>
        <ul className="text-xs text-indigo-700 space-y-1">
          <li>• If temp {'>'} 28°C → Turn on Fan at speed 4</li>
          <li>• If humidity {'>'} 70% → Turn on Exhaust Fan</li>
          <li>• If temp {'<'} 18°C → Send notification to adjust heating</li>
        </ul>
      </div>
    </div>
  );
}
function HistoryTab({ device, config }) {
  // Mock data for demonstration
  const mockData = [
    { time: '00:00', temp: 24.2, humidity: 62 },
    { time: '04:00', temp: 22.8, humidity: 68 },
    { time: '08:00', temp: 25.1, humidity: 58 },
    { time: '12:00', temp: 28.4, humidity: 52 },
    { time: '16:00', temp: 29.4, humidity: 68 },
    { time: '20:00', temp: 26.8, humidity: 65 },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">24-Hour Trend</h4>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition">
            24h
          </button>
          <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs hover:bg-indigo-200 transition">
            7d
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition">
            30d
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-end justify-between gap-1">
        {mockData.map((point, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col gap-1">
              <div
                className="w-full bg-orange-400 rounded-t hover:bg-orange-500 cursor-pointer transition"
                style={{ height: `${(point.temp / 35) * 120}px` }}
                title={`${point.temp}°C`}
              ></div>
              <div
                className="w-full bg-blue-400 rounded-t hover:bg-blue-500 cursor-pointer transition"
                style={{ height: `${(point.humidity / 100) * 120}px` }}
                title={`${point.humidity}%`}
              ></div>
            </div>
            <span className="text-[10px] text-gray-600 mt-1">{point.time}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded"></div>
          <span className="text-gray-600">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span className="text-gray-600">Humidity</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Avg Temperature</p>
            <p className="text-2xl font-bold text-orange-600">26.1°C</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Avg Humidity</p>
            <p className="text-2xl font-bold text-blue-600">62%</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Max Temperature</p>
            <p className="text-2xl font-bold text-red-600">29.4°C</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Max Humidity</p>
            <p className="text-2xl font-bold text-indigo-600">68%</p>
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
        <Download className="w-4 h-4" />
        Export Data ({config.exportFormat.toUpperCase()})
      </button>
    </div>
  );
}
