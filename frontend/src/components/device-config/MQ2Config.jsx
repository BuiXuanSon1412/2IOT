import { useState } from 'react';
import DeviceTabs from './DeviceTabs';
import { AlertTriangle, Bell, Info, TrendingUp, Settings, Download, Flame, Wind } from 'lucide-react';

export function MQ2Config({ device }) {
  const [config, setConfig] = useState({
    // Thresholds (PPM - Parts Per Million)
    warningThreshold: 300,
    criticalThreshold: 1000,
    emergencyThreshold: 2000,

    // Gas Type Sensitivity
    smokeEnabled: true,
    lpgEnabled: true,
    coEnabled: true,
    smokeSensitivity: 3, // 1-5
    lpgSensitivity: 3,
    coSensitivity: 3,

    // Calibration
    baselineCalibration: 0, // PPM offset
    lastCalibrationDate: '2024-12-15',

    // Emergency Actions
    emergencyActions: [
      { enabled: true, device: 'fan-kitchen01-001', action: 'turn on max speed' },
      { enabled: true, device: 'alarm', action: 'activate siren' },
    ],

    // Alerts
    instantAlert: true, // No delay for critical alerts
    alertCooldown: 5, // minutes (for non-critical)
    emailNotify: true,
    pushNotify: true,
    smsNotify: true,

    // Data Logging
    pollingIntervalSec: 2, // Faster than DHT22 for safety
    dataRetentionDays: 90,
    exportFormat: 'csv',

    // Advanced
    warmupTime: 60, // seconds before sensor is stable
    preheatingEnabled: true,
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
        "Current Status": <StatusTab device={device} config={config} />,
        "Thresholds": <ThresholdsTab config={config} updateConfig={updateConfig} device={device} />,
        "Gas Types": <GasTypesTab config={config} updateConfig={updateConfig} />,
        "Emergency Actions": <EmergencyTab config={config} updateConfig={updateConfig} />,
        "Alerts": <AlertsTab config={config} updateConfig={updateConfig} />,
        "Calibration": <CalibrationTab config={config} updateConfig={updateConfig} />,
        "History": <HistoryTab device={device} config={config} />
      }} />
    </div>
  );
}

// ============= TAB COMPONENTS =============

function StatusTab({ device, config }) {
  const getStatusLevel = () => {
    if (device.gasLevel >= config.emergencyThreshold) return 'emergency';
    if (device.gasLevel >= config.criticalThreshold) return 'critical';
    if (device.gasLevel >= config.warningThreshold) return 'warning';
    return 'safe';
  };

  const status = getStatusLevel();

  const statusConfig = {
    safe: {
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      icon: '✓',
      message: 'Air Quality Normal',
      ringColor: 'ring-green-500'
    },
    warning: {
      color: 'yellow',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-600',
      icon: '⚠',
      message: 'Caution - Elevated Levels',
      ringColor: 'ring-yellow-500'
    },
    critical: {
      color: 'red',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      icon: '⚠',
      message: 'ALERT - High Gas Levels',
      ringColor: 'ring-red-500'
    },
    emergency: {
      color: 'red',
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: '🚨',
      message: 'EMERGENCY - EVACUATE AREA',
      ringColor: 'ring-red-600'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="space-y-6">
      {/* Main Status Display */}
      <div className={`${currentStatus.bg} border-2 ${currentStatus.border} rounded-xl p-6 text-center ${status === 'emergency' ? 'animate-pulse' : ''
        }`}>
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${currentStatus.bg} ring-4 ${currentStatus.ringColor} mb-4`}>
          <AlertTriangle className={`w-12 h-12 ${currentStatus.text}`} />
        </div>
        <h3 className={`text-2xl font-bold ${currentStatus.text} mb-2`}>
          {currentStatus.icon} {currentStatus.message}
        </h3>
        <div className="text-4xl font-bold text-gray-900 mb-1">
          {device.gasLevel} <span className="text-xl text-gray-600">PPM</span>
        </div>
        <p className="text-sm text-gray-600">
          Threshold: {config.criticalThreshold} PPM
        </p>
      </div>

      {/* Gas Level Visualization */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Gas Concentration</span>
          <span className="font-semibold">{device.gasLevel} / {config.emergencyThreshold} PPM</span>
        </div>
        <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-6 rounded-full transition-all duration-500 ${status === 'emergency' ? 'bg-red-600' :
              status === 'critical' ? 'bg-red-500' :
                status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            style={{ width: `${Math.min((device.gasLevel / config.emergencyThreshold) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 PPM</span>
          <span className="text-yellow-600">{config.warningThreshold}</span>
          <span className="text-orange-600">{config.criticalThreshold}</span>
          <span className="text-red-600">{config.emergencyThreshold}</span>
        </div>
      </div>

      {/* Gas Detection Status */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-4 rounded-lg text-center border-2 ${device.smokeDetected
          ? 'bg-red-100 border-red-400'
          : 'bg-gray-50 border-gray-200'
          }`}>
          <Flame className={`w-8 h-8 mx-auto mb-2 ${device.smokeDetected ? 'text-red-600' : 'text-gray-400'
            }`} />
          <p className="text-xs text-gray-600 mb-1">Smoke</p>
          <p className={`text-sm font-bold ${device.smokeDetected ? 'text-red-600' : 'text-gray-400'
            }`}>
            {device.smokeDetected ? 'DETECTED' : 'Clear'}
          </p>
        </div>

        <div className={`p-4 rounded-lg text-center border-2 ${device.lpgDetected
          ? 'bg-red-100 border-red-400'
          : 'bg-gray-50 border-gray-200'
          }`}>
          <Wind className={`w-8 h-8 mx-auto mb-2 ${device.lpgDetected ? 'text-red-600' : 'text-gray-400'
            }`} />
          <p className="text-xs text-gray-600 mb-1">LPG</p>
          <p className={`text-sm font-bold ${device.lpgDetected ? 'text-red-600' : 'text-gray-400'
            }`}>
            {device.lpgDetected ? 'DETECTED' : 'Clear'}
          </p>
        </div>

        <div className={`p-4 rounded-lg text-center border-2 ${device.coDetected
          ? 'bg-red-100 border-red-400'
          : 'bg-gray-50 border-gray-200'
          }`}>
          <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${device.coDetected ? 'text-red-600' : 'text-gray-400'
            }`} />
          <p className="text-xs text-gray-600 mb-1">CO</p>
          <p className={`text-sm font-bold ${device.coDetected ? 'text-red-600' : 'text-gray-400'
            }`}>
            {device.coDetected ? 'DETECTED' : 'Clear'}
          </p>
        </div>
      </div>

      {/* Safety Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Safety Reference Levels (PPM):</strong>
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 0-300: Safe air quality</li>
          <li>• 300-1000: Elevated levels - ventilate area</li>
          <li>• 1000-2000: Dangerous - evacuate immediately</li>
          <li>• 2000+: Life-threatening - call emergency services</li>
        </ul>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          📡 <strong>Sensor Type:</strong> MQ-2 Gas & Smoke Detection Sensor - Monitors combustible gases, LPG, smoke, and carbon monoxide
        </p>
      </div>
    </div>
  );
}

function ThresholdsTab({ config, updateConfig, device }) {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ Gas detection thresholds are critical safety settings. Only adjust if you understand gas concentration levels.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Warning Threshold (Early Alert)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={config.warningThreshold}
            onChange={(e) => updateConfig('warningThreshold', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          />
          <span className="text-gray-600">PPM</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Alert when gas levels first become elevated</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Critical Threshold (High Alert)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={config.criticalThreshold}
            onChange={(e) => updateConfig('criticalThreshold', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <span className="text-gray-600">PPM</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Trigger loud alerts and automated actions</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emergency Threshold (Maximum Alert)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={config.emergencyThreshold}
            onChange={(e) => updateConfig('emergencyThreshold', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <span className="text-gray-600">PPM</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Life-threatening levels - activate all emergency protocols</p>
      </div>

      {/* Visual Threshold Display */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Threshold Visualization</h4>
        <div className="relative h-40 bg-gradient-to-r from-green-100 via-yellow-100 via-orange-100 to-red-200 rounded-lg p-4">
          {/* Current level indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gray-900 z-10"
            style={{ left: `${Math.min((device.gasLevel / config.emergencyThreshold) * 100, 100)}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              Current: {device.gasLevel} PPM
            </div>
          </div>

          {/* Threshold markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-600"
            style={{ left: `${(config.warningThreshold / config.emergencyThreshold) * 100}%` }}
          >
            <span className="absolute top-full mt-1 -translate-x-1/2 text-xs font-semibold text-yellow-700">
              Warning
            </span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-orange-600"
            style={{ left: `${(config.criticalThreshold / config.emergencyThreshold) * 100}%` }}
          >
            <span className="absolute top-full mt-1 -translate-x-1/2 text-xs font-semibold text-orange-700">
              Critical
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-8">
          <span>0 PPM (Safe)</span>
          <span>{config.emergencyThreshold} PPM (Emergency)</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            updateConfig('warningThreshold', 300);
            updateConfig('criticalThreshold', 1000);
            updateConfig('emergencyThreshold', 2000);
          }}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

function GasTypesTab({ config, updateConfig }) {
  const gasTypes = [
    {
      key: 'smoke',
      label: 'Smoke Detection',
      icon: '🔥',
      description: 'Detects combustion smoke particles'
    },
    {
      key: 'lpg',
      label: 'LPG (Liquefied Petroleum Gas)',
      icon: '⛽',
      description: 'Propane, butane, and natural gas leaks'
    },
    {
      key: 'co',
      label: 'CO (Carbon Monoxide)',
      icon: '☠️',
      description: 'Colorless, odorless toxic gas'
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Configure detection sensitivity for different gas types. Higher sensitivity = earlier detection but more false positives.
      </p>

      {gasTypes.map((gas) => (
        <div key={gas.key} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{gas.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{gas.label}</p>
                <p className="text-xs text-gray-500">{gas.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config[`${gas.key}Enabled`]}
                onChange={(e) => updateConfig(`${gas.key}Enabled`, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {config[`${gas.key}Enabled`] && (
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Sensitivity Level: {config[`${gas.key}Sensitivity`]}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={config[`${gas.key}Sensitivity`]}
                onChange={(e) => updateConfig(`${gas.key}Sensitivity`, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low (1)</span>
                <span>Medium (3)</span>
                <span>High (5)</span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Recommended:</strong> Keep all gas types enabled for maximum safety. Use sensitivity level 3-4 for balanced detection.
        </p>
      </div>
    </div>
  );
}

function EmergencyTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          🚨 Emergency actions are triggered automatically when gas levels reach critical thresholds. Configure carefully.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">Automated Emergency Actions</h4>
          <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition">
            + Add Action
          </button>
        </div>

        {config.emergencyActions.map((action, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={action.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-900">Action {idx + 1}</span>
              </div>
              <button className="text-red-500 text-sm hover:text-red-700">Remove</button>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Control Device</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="fan-kitchen01-001">Kitchen Exhaust Fan</option>
                <option value="fan-living01-001">Living Room Fan</option>
                <option value="alarm">Emergency Alarm/Siren</option>
                <option value="notification">Send Emergency Notification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Action</label>
              <input
                type="text"
                value={action.action}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="e.g., turn on max speed, activate siren"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Trigger Level</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="warning">Warning Threshold</option>
                <option value="critical">Critical Threshold</option>
                <option value="emergency">Emergency Threshold</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Emergency Contact</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Primary Contact Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Secondary Contact Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 987-6543"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 text-red-600 rounded" defaultChecked />
            <span className="text-sm text-gray-700">Automatically call emergency services at emergency threshold</span>
          </label>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-800">
          <strong>Test Emergency Protocol:</strong> Click below to simulate emergency and verify all actions work correctly (no actual gas required).
        </p>
        <button className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
          Run Emergency Test
        </button>
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
            Instant Critical Alerts (No Delay)
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.instantAlert}
              onChange={(e) => updateConfig('instantAlert', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Send alerts immediately when critical/emergency thresholds are exceeded (recommended)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Cooldown for Warning Level
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
        <p className="text-xs text-gray-500 mt-1">Minimum time between warning alerts (does not apply to critical/emergency)</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Notification Methods
        </label>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition border-2 border-red-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">SMS Alerts (Critical Only)</p>
                <p className="text-xs text-gray-500">Instant text message for emergencies</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.smsNotify}
              onChange={(e) => updateConfig('smsNotify', e.target.checked)}
              className="w-4 h-4 text-red-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Instant app notifications on your device</p>
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
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Detailed alert emails with sensor data</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.emailNotify}
              onChange={(e) => updateConfig('emailNotify', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition border-2 border-yellow-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Audible Siren/Alarm</p>
                <p className="text-xs text-gray-500">Activate local alarm system</p>
              </div>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 text-yellow-600 rounded"
              defaultChecked
            />
          </label>
        </div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          🚨 <strong>Important:</strong> Enable multiple notification methods for redundancy. Gas emergencies require immediate attention.
        </p>
      </div>
    </div>
  );
}
function CalibrationTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚙️ MQ-2 sensors require periodic calibration in clean air. Last calibrated: <strong>{config.lastCalibrationDate}</strong>
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Baseline Calibration Offset: {config.baselineCalibration} PPM
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          step="5"
          value={config.baselineCalibration}
          onChange={(e) => updateConfig('baselineCalibration', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-100 PPM</span>
          <span>0 PPM</span>
          <span>+100 PPM</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Pre-heating (Warmup Period)
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.preheatingEnabled}
              onChange={(e) => updateConfig('preheatingEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Sensor needs {config.warmupTime} seconds to stabilize after power-on</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Calibration Procedure</h4>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
          <li>Ensure sensor is in clean, fresh air environment</li>
          <li>Power on sensor and wait for {config.warmupTime} seconds warmup</li>
          <li>Click "Start Calibration" below</li>
          <li>System will read baseline and set zero point</li>
          <li>Calibration complete - sensor ready for use</li>
        </ol>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
          Start Calibration
        </button>
        <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
          Reset to Factory
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Calibrate sensor monthly or whenever readings seem inaccurate. Always calibrate in outdoor or well-ventilated indoor clean air.
        </p>
      </div>
    </div>
  );
}
function HistoryTab({ device, config }) {
  // Mock alert history
  const alertHistory = [
    { time: '2 hours ago', level: 'Warning', ppm: 350, resolved: true },
    { time: '1 day ago', level: 'Critical', ppm: 1200, resolved: true },
    { time: '3 days ago', level: 'Warning', ppm: 420, resolved: true },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Alert History</h4>
        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="space-y-2">
        {alertHistory.map((alert, idx) => (
          <div key={idx} className={`p-4 rounded-lg border-2 ${alert.level === 'Critical' ? 'bg-red-50 border-red-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-bold ${alert.level === 'Critical' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                {alert.level === 'Critical' ? '🚨' : '⚠️'} {alert.level} Alert
              </span>
              <span className="text-xs text-gray-600">{alert.time}</span>
            </div>
            <p className="text-sm text-gray-700">
              Gas level reached <strong>{alert.ppm} PPM</strong>
            </p>
            {alert.resolved && (
              <p className="text-xs text-green-600 mt-1">✓ Resolved - Levels returned to normal</p>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistics (30 Days)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Total Alerts</p>
            <p className="text-2xl font-bold text-yellow-600">12</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Critical Events</p>
            <p className="text-2xl font-bold text-red-600">2</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Avg Response Time</p>
            <p className="text-2xl font-bold text-green-600">45s</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Uptime</p>
            <p className="text-2xl font-bold text-blue-600">99.8%</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-900 mb-2">Safety Score</h5>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <span className="text-2xl font-bold text-green-600">87/100</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Based on alert frequency, response time, and system reliability
        </p>
      </div>
    </div>
  );
}

