import { useState, useEffect } from 'react';
import { DeviceControlModal } from '../components/DeviceControlModal';
import { StatCard } from '../components/StatCard';
import apiService from '../services/apiService';
import { Thermometer, Droplets, Wind, Activity, AlertCircle, RotateCw } from 'lucide-react';

export default function MonitorScreen() {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState({});
  const [sensors, setSensors] = useState({});
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch devices and sensors on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch devices
      const devicesResult = await apiService.getAllDevices();
      if (!devicesResult.success) {
        throw new Error(devicesResult.error);
      }

      // Fetch sensors
      const sensorsResult = await apiService.getAllSensors();
      if (!sensorsResult.success) {
        throw new Error(sensorsResult.error);
      }

      if (!Array.isArray(devicesResult.data)) {
        throw new Error('Invalid devices data format');
      }

      if (!Array.isArray(sensorsResult.data)) {
        throw new Error('Invalid sensors data format');
      }

      // Transform devices array to object with device.id as key
      const devicesObj = {};
      devicesResult.data.forEach(device => {
        if (!device._id || !device.deviceType) {
          console.warn('Skipping invalid device:', device);
          return; // Skip invalid devices
        }

        devicesObj[device._id] = {
          ...device,
          id: device._id,
          icon: getDeviceIcon(device.deviceType),
          iconComponent: getDeviceIconComponent(device.deviceType),
        };
      });

      // Transform sensors array to object
      const sensorsObj = {};
      sensorsResult.data.forEach(sensor => {
        sensorsObj[sensor._id] = {
          ...sensor,
          id: sensor._id,
          icon: '🌡️',
          status: sensor.status || 'online', // ADD THIS LINE
        };
      });

      setDevices(devicesObj);
      setSensors(sensorsObj);

      // Organize into floors and rooms
      organizeFloors(devicesResult.data, sensorsResult.data);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const organizeFloors = (devicesList, sensorsList) => {
    // Group by floor
    const floorMap = {};

    const allItems = [
      ...devicesList,
      ...sensorsList.map(sensor => ({
        ...sensor,
        status: sensor.status || 'online', // ADD DEFAULT STATUS
      }))
    ];

    allItems.forEach(item => {
      const floor = item.area?.floor || 'Floor 1';
      const room = item.area?.room || 'Unknown Room';

      if (!floorMap[floor]) {
        floorMap[floor] = {};
      }

      if (!floorMap[floor][room]) {
        floorMap[floor][room] = [];
      }

      floorMap[floor][room].push(item._id);
    });

    // Convert to floors array
    const floorsArray = Object.entries(floorMap).map(([floorName, rooms]) => ({
      name: floorName,
      rooms: Object.entries(rooms).map(([roomName, deviceIds], idx) => ({
        name: roomName,
        x: 60 + (idx % 3) * 180,
        y: 40 + Math.floor(idx / 3) * 180,
        width: 170,
        height: 160,
        devices: deviceIds,
      })),
    }));

    setFloors(floorsArray);
  };

  const handleDeviceClick = (deviceId) => {
    const device = devices[deviceId] || sensors[deviceId];

    // ADD VALIDATION
    if (!device) {
      console.error('Device not found:', deviceId);
      setError('Device not found. Please refresh the page.');
      return;
    }

    if (typeof device !== 'object') {
      console.error('Invalid device data:', device);
      setError('Invalid device data. Please refresh the page.');
      return;
    }

    setSelectedDevice(device);
  };

  const handleDeviceUpdate = async (updatedDevice) => {
    try {
      // Update device characteristics
      const result = await apiService.updateDeviceCharacteristics(
        updatedDevice._id,
        updatedDevice.characteristic
      );

      if (result.success) {
        // Update local state
        setDevices(prev => ({
          ...prev,
          [updatedDevice._id]: updatedDevice
        }));

        // Send control command via MQTT
        //const controlResult = await apiService.sendControlCommand(
        //  updatedDevice.name,
        //  updatedDevice.characteristic
        //);

        if (!controlResult.success) {
          console.warn('Control command failed:', controlResult.error);
          // Don't throw - characteristic was updated, just log warning
        }
      } else {
        throw new Error(result.error || 'Failed to update device');
      }
    } catch (error) {
      console.error('Error updating device:', error);
      // Re-throw so DeviceControlModal can handle it
      throw error;
    }
  };

  const handleToggleStatus = async (deviceId, currentStatus) => {
    const newStatus = currentStatus == 'online' ? 'offline' : 'online';
    console.log("handleToggleStatus", newStatus);
    try {
      const result = await apiService.toggleDeviceStatus(deviceId, newStatus);
      console.log(newStatus)
      if (result.success) {
        setDevices(prev => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            status: newStatus
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling device status:', error);
    }
  };

  // Calculate stats from real data
  const calculateStats = () => {
    const allDevices = Object.values(devices);
    const onlineCount = allDevices.filter(d => d.status === 'online').length;
    const totalCount = allDevices.length;

    // Get average temperature and humidity from sensors
    const allSensors = Object.values(sensors);
    const tempSensors = allSensors.filter(s => s.measures?.some(m => m.measure === 'temperature'));
    const avgTemp = tempSensors.length > 0
      ? (tempSensors.reduce((sum, s) => sum + (s.currentValue || 0), 0) / tempSensors.length).toFixed(1)
      : 'N/A';

    const humiditySensors = allSensors.filter(s => s.measures?.some(m => m.measure === 'humidity'));
    const avgHumidity = humiditySensors.length > 0
      ? Math.round(humiditySensors.reduce((sum, s) => sum + (s.currentValue || 0), 0) / humiditySensors.length)
      : 'N/A';

    return { onlineCount, totalCount, avgTemp, avgHumidity };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-900">Loading your smart home...</p>
          <p className="text-sm text-gray-600 mt-2">Fetching devices and sensors</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Data</h3>
            <p className="text-red-700 mb-6">{error}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchData}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
              >
                <RotateCw className="w-5 h-5" />
                Retry Connection
              </button>
              <button
                onClick={() => {
                  authService.clearAuth();
                  window.location.href = '/';
                }}
                className="px-6 py-3 bg-white border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition font-medium"
              >
                Logout & Restart
              </button>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Troubleshooting Tips:</strong>
              </p>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• Check if the backend server is running on port 3000</li>
                <li>• Verify your internet connection</li>
                <li>• Make sure CORS is properly configured</li>
                <li>• Check browser console for detailed errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find the empty floors check (around line 190)
  // REPLACE WITH:
  if (floors.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SmartHome!</h3>
            <p className="text-gray-700 mb-6">
              No devices or sensors found yet. Let's get started by adding your first device.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => window.location.href = '/settings'} // Assuming you have routing
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Add Devices
              </button>
              <button
                onClick={fetchData}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
              >
                <RotateCw className="w-5 h-5" />
                Refresh
              </button>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Quick Setup Guide:</strong>
              </p>
              <ol className="text-sm text-gray-600 text-left space-y-1">
                <li>1. Navigate to Settings → Device Management</li>
                <li>2. Click "Add Device" and fill in device details</li>
                <li>3. Return here to see your devices on the floor plan</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentFloor = floors[selectedFloor];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Floor Monitor</h2>
          <p className="text-gray-600 text-sm mt-1">Click on any device to control it</p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Avg Temperature"
          value={`${stats.avgTemp}°C`}
          status="optimal"
        />
        <StatCard
          icon={<Droplets className="w-5 h-5" />}
          label="Avg Humidity"
          value={`${stats.avgHumidity}%`}
          status="optimal"
        />
        <StatCard
          icon={<Wind className="w-5 h-5" />}
          label="Air Quality"
          value="Good"
          status="optimal"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Active Devices"
          value={`${stats.onlineCount}/${stats.totalCount}`}
          status={stats.onlineCount === stats.totalCount ? "optimal" : "warning"}
        />
      </div>

      <div className="bg-white shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Floor Layout</h3>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          >
            {floors.map((floor, idx) => (
              <option key={idx} value={idx}>{floor.name}</option>
            ))}
          </select>
        </div>

        <div className="relative bg-gray-100 border border-gray-300">
          <svg viewBox="0 0 600 400" className="w-full h-auto">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="400" fill="url(#grid)" />

            {currentFloor.rooms.map((room, idx) => (
              <g key={idx}>
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  rx="0"
                />
                <text
                  x={room.x + room.width / 2}
                  y={room.y + 18}
                  textAnchor="middle"
                  className="fill-gray-700 text-xs font-semibold pointer-events-none"
                >
                  {room.name}
                </text>

                {room.devices.map((deviceId, dIdx) => {
                  const device = devices[deviceId] || sensors[deviceId];
                  if (!device) return null;
                  // console.log(device.status)
                  return (
                    <g
                      key={dIdx}
                      onClick={() => handleDeviceClick(deviceId)}
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={room.x + 18 + dIdx * 30}
                        cy={room.y + room.height - 18}
                        r="12"
                        fill="white"
                        stroke={device.status === 'online' ? '#10b981' : '#ef4444'}
                        strokeWidth="2"
                        className="hover:opacity-80 transition"
                      />
                      <text
                        x={room.x + 18 + dIdx * 30}
                        y={room.y + room.height - 13}
                        textAnchor="middle"
                        className="fill-white text-sm pointer-events-none"
                      >
                        {device.icon}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Online - Click to control</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600">Offline</span>
          </div>
        </div>
      </div>

      {selectedDevice && (
        <DeviceControlModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdate={handleDeviceUpdate}
          onToggle={handleToggleStatus}
        />
      )}
    </div>
  );
}

// Helper functions
function getDeviceIcon(deviceType) {
  const icons = {
    fan: '🌀',
    light: '💡',
    lock: '🔒',
    dht22: '🌡️',
    mq2: '💨',
    bh1750: '☀️',
  };
  return icons[deviceType] || '📱';
}

function getDeviceIconComponent(deviceType) {
  const components = {
    fan: Activity,
    light: Activity,
    lock: Activity,
    dht22: Thermometer,
    mq2: Wind,
    bh1750: Activity,
  };
  return components[deviceType] || Activity;
}
