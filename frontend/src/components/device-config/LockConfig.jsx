import { useState } from 'react';
import DeviceTabs from './DeviceTabs';
import { Lock, Unlock, Key, Bell, Info, TrendingUp, Shield, Clock, User, AlertTriangle } from 'lucide-react';

export function LockConfig({ device }) {
  const [config, setConfig] = useState({
    // Auto-Lock
    autoLockEnabled: true,
    autoLockDelay: 30, // seconds
    autoLockTime: '23:00', // Time-based auto-lock

    // Access Control
    accessCodes: [
      { id: 1, name: 'Master Code', code: '****', enabled: true, permanent: true },
      { id: 2, name: 'Guest Code', code: '****', enabled: true, expiry: '2024-12-31' },
      { id: 3, name: 'Service Code', code: '****', enabled: false, expiry: null },
    ],

    // Security
    maxFailedAttempts: 5,
    lockoutDuration: 300, // seconds (5 min)
    tamperAlert: true,
    forceAlert: true, // Physical force detection

    // Notifications
    unlockNotify: true,
    lockNotify: false,
    failedAttemptNotify: true,
    lowBatteryNotify: true,
    emailNotify: true,
    pushNotify: true,
    smsNotify: false,

    // Advanced
    doubleKnockUnlock: false, // Knock pattern unlock
    geoFenceUnlock: false, // Auto-unlock when home
    geoFenceRadius: 50, // meters
    remoteUnlockEnabled: true,

    // Logs
    logRetentionDays: 90,
    exportFormat: 'csv',
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
        "Lock Status": <StatusTab device={device} config={config} updateConfig={updateConfig} />,
        "Auto-Lock": <AutoLockTab config={config} updateConfig={updateConfig} />,
        "Access Codes": <AccessCodesTab config={config} updateConfig={updateConfig} />,
        "Security": <SecurityTab config={config} updateConfig={updateConfig} />,
        "Notifications": <NotificationsTab config={config} updateConfig={updateConfig} />,
        "Advanced": <AdvancedTab config={config} updateConfig={updateConfig} />,
        "Access Log": <AccessLogTab device={device} config={config} />
      }} />
    </div>
  );
}

// ============= TAB COMPONENTS =============

function StatusTab({ device, config, updateConfig }) {
  return (
    <div className="space-y-6">
      {/* Main Lock Status */}
      <div className={`${device.locked ? 'bg-indigo-50' : 'bg-orange-50'} border-2 ${device.locked ? 'border-indigo-200' : 'border-orange-200'
        } rounded-xl p-8 text-center`}>
        {device.locked ? (
          <Lock className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
        ) : (
          <Unlock className="w-20 h-20 text-orange-600 mx-auto mb-4" />
        )}
        <h3 className={`text-3xl font-bold ${device.locked ? 'text-indigo-600' : 'text-orange-600'} mb-2`}>
          {device.locked ? '🔒 LOCKED' : '🔓 UNLOCKED'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {device.locked ? 'Door is secure' : 'Door is accessible'}
        </p>
        <button
          onClick={() => {/* Toggle lock */ }}
          className={`px-6 py-3 rounded-lg font-semibold transition ${device.locked
            ? 'bg-orange-600 hover:bg-orange-700 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
        >
          {device.locked ? 'Unlock Door' : 'Lock Door'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600">Last Access</p>
          <p className="text-lg font-bold text-gray-900">{device.lastAccess}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <User className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600">Active Codes</p>
          <p className="text-lg font-bold text-gray-900">
            {config.accessCodes.filter(c => c.enabled).length}/{config.accessCodes.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600">Battery</p>
          <p className="text-lg font-bold text-green-600">{device.battery}%</p>
        </div>
      </div>

      {/* Auto-Lock Status */}
      {config.autoLockEnabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Auto-Lock Active</p>
              <p className="text-xs text-blue-700">
                Door will automatically lock after {config.autoLockDelay} seconds
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {device.accessLog && device.accessLog.slice(0, 3).map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {log.action === 'unlock' ? (
                  <Unlock className="w-4 h-4 text-orange-600" />
                ) : (
                  <Lock className="w-4 h-4 text-indigo-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.user}</p>
                  <p className="text-xs text-gray-500">{log.time}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold ${log.action === 'unlock' ? 'text-orange-600' : 'text-indigo-600'
                }`}>
                {log.action === 'unlock' ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Battery Warning */}
      {device.battery < 20 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">Low Battery Warning</p>
              <p className="text-xs text-yellow-700">
                Battery at {device.battery}% - Replace batteries soon to avoid lockout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AutoLockTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Enable Auto-Lock
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoLockEnabled}
              onChange={(e) => updateConfig('autoLockEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Automatically lock the door after it's unlocked</p>
      </div>

      {config.autoLockEnabled && (
        <div className="space-y-6 pl-4 border-l-2 border-indigo-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Lock Delay: {config.autoLockDelay} seconds
            </label>
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={config.autoLockDelay}
              onChange={(e) => updateConfig('autoLockDelay', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5s</span>
              <span>1min</span>
              <span>2min</span>
              <span>5min</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Time to wait after unlocking before automatically locking again
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => updateConfig('autoLockDelay', 15)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition ${config.autoLockDelay === 15
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              15s
            </button>
            <button
              onClick={() => updateConfig('autoLockDelay', 30)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition ${config.autoLockDelay === 30
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              30s
            </button>
            <button
              onClick={() => updateConfig('autoLockDelay', 60)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition ${config.autoLockDelay === 60
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              1min
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scheduled Auto-Lock
        </label>
        <p className="text-xs text-gray-500 mb-3">Lock automatically at a specific time each day</p>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={config.autoLockTime}
            onChange={(e) => updateConfig('autoLockTime', e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          ✓ <strong>Recommended:</strong> Enable auto-lock with 30-60 second delay for security while maintaining convenience.
        </p>
      </div>
    </div>
  );
}

function AccessCodesTab({ config, updateConfig }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Access Codes</h4>
          <p className="text-xs text-gray-500 mt-1">Manage PIN codes for different users</p>
        </div>
        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition">
          + Add Code
        </button>
      </div>

      <div className="space-y-3">
        {config.accessCodes.map((code) => (
          <div
            key={code.id}
            className={`border-2 rounded-lg p-4 ${code.enabled
              ? 'border-green-200 bg-green-50'
              : 'border-gray-200 bg-gray-50'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Key className={`w-5 h-5 ${code.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{code.name}</p>
                  <p className="text-xs text-gray-500">Code: {code.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={code.enabled}
                    disabled={code.permanent}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                {!code.permanent && (
                  <button className="text-red-500 text-sm hover:text-red-700">
                    Delete
                  </button>
                )}
              </div>
            </div>

            {code.expiry && (
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">
                  Expires: {code.expiry}
                </span>
              </div>
            )}

            {code.permanent && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                <Shield className="w-3 h-3" />
                Master Code (Cannot be deleted)
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Access Code Tips:</strong>
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use 6-8 digit codes for better security</li>
          <li>• Set expiry dates for temporary guests</li>
          <li>• Disable codes instead of deleting to keep access history</li>
          <li>• Change master code periodically</li>
        </ul>
      </div>
    </div>
  );
}

function SecurityTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Failed Attempts
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="3"
            max="10"
            value={config.maxFailedAttempts}
            onChange={(e) => updateConfig('maxFailedAttempts', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-600">attempts</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Lock will enter lockout mode after this many incorrect codes</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lockout Duration
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="60"
            max="3600"
            step="60"
            value={config.lockoutDuration}
            onChange={(e) => updateConfig('lockoutDuration', Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-600">seconds</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.floor(config.lockoutDuration / 60)} minutes - Time before lock accepts codes again
        </p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Security Alerts</h4>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition border-2 border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Tamper Detection</p>
                <p className="text-xs text-gray-500">Alert if lock is physically tampered with</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.tamperAlert}
              onChange={(e) => updateConfig('tamperAlert', e.target.checked)}
              className="w-4 h-4 text-red-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition border-2 border-orange-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Force Detection</p>
                <p className="text-xs text-gray-500">Alert if excessive force applied to lock</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.forceAlert}
              onChange={(e) => updateConfig('forceAlert', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded"
            />
          </label>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-1">Security Recommendations</p>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• Enable all security alerts for maximum protection</li>
              <li>• Set lockout to at least 5 minutes after 5 failed attempts</li>
              <li>• Review access logs regularly for suspicious activity</li>
              <li>• Keep emergency access method available (physical key)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-gray-900">Event Notifications</h4>

      <div className="space-y-3">
        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">Unlock Notifications</p>
            <p className="text-xs text-gray-500">Alert when door is unlocked</p>
          </div>
          <input
            type="checkbox"
            checked={config.unlockNotify}
            onChange={(e) => updateConfig('unlockNotify', e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">Lock Notifications</p>
            <p className="text-xs text-gray-500">Alert when door is locked</p>
          </div>
          <input
            type="checkbox"
            checked={config.lockNotify}
            onChange={(e) => updateConfig('lockNotify', e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 border-2 border-yellow-200">
          <div>
            <p className="text-sm font-medium text-gray-900">Failed Attempt Alerts</p>
            <p className="text-xs text-gray-500">Alert on incorrect access codes</p>
          </div>
          <input
            type="checkbox"
            checked={config.failedAttemptNotify}
            onChange={(e) => updateConfig('failedAttemptNotify', e.target.checked)}
            className="w-4 h-4 text-yellow-600 rounded"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 border-2 border-orange-200">
          <div>
            <p className="text-sm font-medium text-gray-900">Low Battery Alerts</p>
            <p className="text-xs text-gray-500">Alert when battery below 20%</p>
          </div>
          <input
            type="checkbox"
            checked={config.lowBatteryNotify}
            onChange={(e) => updateConfig('lowBatteryNotify', e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded"
          />
        </label>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Notification Methods</h4>
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
              <p className="text-xs text-gray-500">Instant alerts on your device</p>
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
              <p className="text-xs text-gray-500">Detailed access reports via email</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 border-2 border-red-200">
            <input
              type="checkbox"
              checked={config.smsNotify}
              onChange={(e) => updateConfig('smsNotify', e.target.checked)}
              className="w-4 h-4 text-red-600 rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">SMS Alerts (Security Events Only)</p>
              <p className="text-xs text-gray-500">Text message for critical security events</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

function AdvancedTab({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Remote Unlock
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.remoteUnlockEnabled}
              onChange={(e) => updateConfig('remoteUnlockEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Allow unlocking via app when you're away</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Double-Knock Unlock
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.doubleKnockUnlock}
              onChange={(e) => updateConfig('doubleKnockUnlock', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">Unlock by knocking in a specific pattern (experimental)</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Geo-Fence Auto-Unlock
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox"
              checked={config.geoFenceUnlock}
              onChange={(e) => updateConfig('geoFenceUnlock', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500 mb-3">Automatically unlock when you arrive home</p>

        {config.geoFenceUnlock && (
          <div>
            <label className="block text-xs text-gray-600 mb-1">Detection Radius</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="10"
                max="200"
                value={config.geoFenceRadius}
                onChange={(e) => updateConfig('geoFenceRadius', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-600">meters</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-900 mb-1">Security Notice</p>
            <p className="text-xs text-yellow-700">
              Advanced features like geo-fence unlock and remote access reduce security. Only enable if you understand the risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function AccessLogTab({ device, config }) {
  const mockAccessLog = [
    { id: 1, user: 'John', action: 'unlock', method: 'Master Code', time: '2 hours ago', success: true },
    { id: 2, user: 'Sarah', action: 'lock', method: 'App', time: '5 hours ago', success: true },
    { id: 3, user: 'Unknown', action: 'unlock', method: 'Invalid Code', time: '1 day ago', success: false },
    { id: 4, user: 'Guest', action: 'unlock', method: 'Guest Code', time: '2 days ago', success: true },
    { id: 5, user: 'John', action: 'unlock', method: 'Master Code', time: '3 days ago', success: true },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Access History</h4>
        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="space-y-2">
        {mockAccessLog.map((log) => (
          <div
            key={log.id}
            className={`p-4 rounded-lg border-2 ${log.success
              ? 'bg-white border-gray-200'
              : 'bg-red-50 border-red-200'
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {log.success ? (
                  log.action === 'unlock' ? (
                    <Unlock className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-indigo-600" />
                  )
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{log.user}</p>
                  <p className="text-xs text-gray-500">{log.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-semibold ${log.success
                  ? log.action === 'unlock' ? 'text-orange-600' : 'text-indigo-600'
                  : 'text-red-600'
                  }`}>
                  {log.success ? (log.action === 'unlock' ? 'Unlocked' : 'Locked') : 'Failed'}
                </p>
                <p className="text-xs text-gray-500">{log.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Usage Statistics (30 Days)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Total Accesses</p>
            <p className="text-2xl font-bold text-indigo-600">147</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Failed Attempts</p>
            <p className="text-2xl font-bold text-red-600">3</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Most Active User</p>
            <p className="text-lg font-bold text-green-600">John</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Peak Time</p>
            <p className="text-lg font-bold text-orange-600">18:00</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-900 mb-2">Security Score</h5>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <span className="text-2xl font-bold text-green-600">92/100</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Excellent security practices - low failed attempts, regular code updates
        </p>
      </div>
    </div>
  );
}
