import { useState, useEffect } from 'react';
import { Plus, Trash2, X, AlertCircle, Clock, Zap, Settings } from 'lucide-react';
import apiService from '../services/apiService';

// ============= AUTO-BEHAVIOR CONFIGURATION =============
function AutoBehaviorTab({ device, onDeviceUpdated }) {
  const [rules, setRules] = useState([]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRules(device.settings?.autoBehavior || []);
  }, [device]);

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    const result = await apiService.getAllSensors();
    if (result.success) {
      setSensors(result.data);
    }
  };

  const handleAddRule = async (newRule) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.addAutoBehavior(
        device.name,
        newRule.measure,
        newRule.range,
        newRule.action
      );

      if (result.success) {
        setRules([...rules, newRule]);
        onDeviceUpdated(result.data)
        setShowAddRule(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (rule) => {
    if (!window.confirm('Delete this automation rule?')) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.removeAutoBehavior(
        device.name,
        rule.measure,
        rule.range,
        rule.action
      );

      if (result.success) {
        setRules(rules.filter(r =>
          !(r.measure === rule.measure &&
            JSON.stringify(r.range) === JSON.stringify(rule.range) &&
            JSON.stringify(r.action) === JSON.stringify(rule.action))
        ));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(device.name)
  console.log(rules)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
          <p className="text-sm text-gray-600 mt-1">
            Automatically control this device based on sensor readings
          </p>
        </div>
        <button
          onClick={() => setShowAddRule(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No automation rules configured</p>
            <p className="text-sm text-gray-500 mt-1">
              Add rules to automatically control this device
            </p>
          </div>
        ) : (
          rules.map((rule, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-gray-900">
                      When {rule.measure}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Condition:</strong>{' '}
                      {rule.range.ge && `≥ ${rule.range.ge}`}
                      {rule.range.ge && rule.range.le && ' and '}
                      {rule.range.le && `≤ ${rule.range.le}`}
                    </p>
                    <p>
                      <strong>Action:</strong>{' '}
                      {rule.action.map((a, i) => (
                        <span key={i}>
                          {a.name} = {a.value}
                          {i < rule.action.length - 1 && ', '}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRule(rule)}
                  disabled={loading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddRule && (
        <AddAutoBehaviorModal
          device={device}
          sensors={sensors}
          onClose={() => setShowAddRule(false)}
          onAdd={handleAddRule}
        />
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Example:</strong> If temperature {'>'} 28°C, turn on fan at speed 4
        </p>
      </div>
    </div>
  );
}

// ============= SCHEDULE CONFIGURATION =============
function ScheduleTab({ device }) {
  const [schedules, setSchedules] = useState();
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRules(device.settings?.autoBehavior || []);
  }, [device]);



  const handleAddSchedule = async (newSchedule) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.addSchedule(
        device.name,
        newSchedule.cronExpression,
        newSchedule.action
      );

      if (result.success) {
        setSchedules([...schedules, newSchedule]);
        setShowAddSchedule(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (schedule) => {
    if (!window.confirm('Delete this schedule?')) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.removeSchedule(
        device.name,
        schedule.cronExpression,
        schedule.action
      );

      if (result.success) {
        setSchedules(schedules.filter(s =>
          s.cronExpression !== schedule.cronExpression ||
          JSON.stringify(s.action) !== JSON.stringify(schedule.action)
        ));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseCron = (cronExpression) => {
    const [minute, hour] = cronExpression.split(' ');
    return `${hour}:${minute.padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Actions</h3>
          <p className="text-sm text-gray-600 mt-1">
            Control device at specific times
          </p>
        </div>
        <button
          onClick={() => setShowAddSchedule(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {schedules.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No schedules configured</p>
          </div>
        ) : (
          schedules.map((schedule, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-gray-900">
                      {parseCron(schedule.cronExpression)}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Action:</strong>{' '}
                      {schedule.action.map((a, i) => (
                        <span key={i}>
                          {a.name} = {a.value}
                          {i < schedule.action.length - 1 && ', '}
                        </span>
                      ))}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cron: {schedule.cronExpression}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSchedule(schedule)}
                  disabled={loading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddSchedule && (
        <AddScheduleModal
          device={device}
          onClose={() => setShowAddSchedule(false)}
          onAdd={handleAddSchedule}
        />
      )}
    </div>
  );
}

// ============= MODALS =============
function AddAutoBehaviorModal({ device, sensors, onClose, onAdd }) {
  const [measure, setMeasure] = useState('temperature');
  const [rangeType, setRangeType] = useState('ge');
  const [rangeValue, setRangeValue] = useState('');
  const [actionType, setActionType] = useState('');
  const [actionValue, setActionValue] = useState('');

  const measures = [...new Set(sensors.flatMap(s =>
    s.measures?.map(m => m.measure) || []
  ))];

  const actionOptions = device.deviceType === 'Fan'
    ? [
      { name: 'Fan speed', label: 'Fan Speed', values: ['0', '1', '2', '3', '4', '5'] },
      { name: 'power', label: 'Power', values: ['0', '1'] }
    ]
    : device.deviceType === 'Light'
      ? [
        { name: 'Light level', label: 'Brightness', values: Array.from({ length: 21 }, (_, i) => String(i * 5)) },
        { name: 'power', label: 'Power', values: ['0', '1'] }
      ]
      : [];

  const handleSubmit = () => {
    if (!rangeValue || !actionType || !actionValue) return;

    const range = {};
    if (rangeType === 'ge') range.ge = Number(rangeValue);
    else if (rangeType === 'le') range.le = Number(rangeValue);

    onAdd({
      measure,
      range,
      action: [{
        name: actionType,
        value: actionValue
      }]
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add Automation Rule</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When sensor measures
            </label>
            <select
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {measures.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ge">≥ Greater or Equal</option>
                <option value="le">≤ Less or Equal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <input
                type="number"
                value={rangeValue}
                onChange={(e) => setRangeValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Then set
            </label>
            <select
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                setActionValue('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select action...</option>
              {actionOptions.map(opt => (
                <option key={opt.name} value={opt.name}>{opt.label}</option>
              ))}
            </select>
          </div>

          {actionType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To value
              </label>
              <select
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select value...</option>
                {actionOptions.find(o => o.name === actionType)?.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddScheduleModal({ device, onClose, onAdd }) {
  const [time, setTime] = useState('18:00');
  const [actionType, setActionType] = useState('');
  const [actionValue, setActionValue] = useState('');

  const actionOptions = device.deviceType === 'Fan'
    ? [
      { name: 'Fan speed', label: 'Fan Speed', values: ['0', '1', '2', '3', '4', '5'] },
      { name: 'power', label: 'Power', values: ['0', '1'] }
    ]
    : device.deviceType === 'Light'
      ? [
        { name: 'Light level', label: 'Brightness', values: Array.from({ length: 21 }, (_, i) => String(i * 5)) },
        { name: 'power', label: 'Power', values: ['0', '1'] }
      ]
      : [];

  const handleSubmit = () => {
    if (!time || !actionType || !actionValue) return;

    const [hour, minute] = time.split(':');
    const cronExpression = `${minute} ${hour} * * *`;

    onAdd({
      cronExpression,
      action: [{
        name: actionType,
        value: actionValue
      }]
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add Schedule</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                setActionValue('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select action...</option>
              {actionOptions.map(opt => (
                <option key={opt.name} value={opt.name}>{opt.label}</option>
              ))}
            </select>
          </div>

          {actionType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <select
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select value...</option>
                {actionOptions.find(o => o.name === actionType)?.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= MAIN CONFIGURATION SCREEN =============
export default function ConfigurationScreen() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState('auto-behavior');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    const result = await apiService.getAllDevices();
    if (result.success) {
      setDevices(result.data);
    }
    setLoading(false);
  };

  const DEVICE_TYPES = [
    { value: 'all', label: 'All Devices' },
    { value: 'Light', label: 'Lights' },
    { value: 'Fan', label: 'Fans' },
  ];

  const filteredDevices = deviceTypeFilter === 'all'
    ? devices
    : devices.filter(d => d.deviceType === deviceTypeFilter);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Device Configuration</h2>
        <p className="text-gray-600 mt-1">Manage automation rules and schedules</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-4 h-[600px] flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-3">Devices</h3>

          <select
            value={deviceTypeFilter}
            onChange={(e) => setDeviceTypeFilter(e.target.value)}
            className="mb-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {DEVICE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredDevices.map((device) => (
              <button
                key={device._id}
                onClick={() => setSelectedDevice(device)}
                className={`w-full text-left p-4 rounded-lg transition ${selectedDevice?._id === device._id
                    ? 'bg-indigo-50 border-2 border-indigo-600'
                    : 'bg-white border border-gray-200 hover:border-indigo-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${device.status === 'online'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                    }`}>
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{device.name}</p>
                    <p className="text-sm text-gray-500">{device.deviceType}</p>
                  </div>
                </div>
              </button>
            ))}

            {filteredDevices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No devices found</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          {!selectedDevice ? (
            <div className="text-center text-gray-500 py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a device to configure</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedDevice.name}</h3>
                <p className="text-sm text-gray-500">{selectedDevice.deviceType} • {selectedDevice.area?.room}, {selectedDevice.area?.floor}</p>
              </div>

              <div className="flex gap-2 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('auto-behavior')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition border-b-2 ${activeTab === 'auto-behavior'
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                    }`}
                >
                  <Zap className="w-4 h-4" />
                  Automation
                </button>
                <button
                  onClick={() => setActiveTab('schedules')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition border-b-2 ${activeTab === 'schedules'
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                    }`}
                >
                  <Clock className="w-4 h-4" />
                  Schedules
                </button>
              </div>

              <div className="mt-4">
                {activeTab === 'auto-behavior' && <AutoBehaviorTab device={selectedDevice} onDeviceUpdated={(updatedDevice) => {
                  setDevices(prev =>
                    prev.map(d => d._id === updatedDevice._id ? updatedDevice : d)
                  );
                  setSelectedDevice(updatedDevice);
                }} />}
                {activeTab === 'schedules' && <ScheduleTab device={selectedDevice} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
