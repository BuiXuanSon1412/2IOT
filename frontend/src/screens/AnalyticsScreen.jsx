import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Thermometer, Droplets, Lightbulb, Fan, AlertCircle, RotateCw, Download } from 'lucide-react';
import logApiService from '../services/logApiService';

export default function AnalyticsScreen() {
  const [dateRange, setDateRange] = useState(7); // 7, 14, 30 days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deviceLogs, setDeviceLogs] = useState([]);
  const [sensorLogs, setSensorLogs] = useState([]);
  const [hourlyActivity, setHourlyActivity] = useState([]);
  const [roomUsage, setRoomUsage] = useState([]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [dateRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = logApiService.getDateRange(dateRange);

      const [devicesRes, sensorsRes, hourlyRes, roomsRes] = await Promise.all([
        logApiService.getAggregatedDeviceLogs(startDate, endDate),
        logApiService.getAggregatedSensorLogs(startDate, endDate),
        logApiService.getHourlyDeviceActivity(startDate, endDate),
        logApiService.getDeviceUsageByRoom(startDate, endDate)
      ]);

      if (devicesRes.success) setDeviceLogs(devicesRes.data);
      if (sensorsRes.success) setSensorLogs(sensorsRes.data);
      if (hourlyRes.success) setHourlyActivity(hourlyRes.data);
      if (roomsRes.success) setRoomUsage(roomsRes.data);

      if (!devicesRes.success || !sensorsRes.success) {
        setError('Some analytics failed to load');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchAllAnalytics}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600 mt-1">Historical usage and environmental data</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
          <button
            onClick={fetchAllAnalytics}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards
        deviceLogs={deviceLogs}
        sensorLogs={sensorLogs}
        dateRange={dateRange}
      />

      {/* Device Activity Chart */}
      <DeviceActivityChart deviceLogs={deviceLogs} />

      {/* Sensor Readings Chart */}
      <SensorReadingsChart sensorLogs={sensorLogs} />

      {/* Peak Usage Times */}
      <PeakUsageTimes hourlyActivity={hourlyActivity} />

      {/* Room Usage */}
      <RoomUsageChart roomUsage={roomUsage} />
    </div>
  );
}

// ============= COMPONENTS =============

function OverviewCards({ deviceLogs, sensorLogs, dateRange }) {
  // Calculate totals
  const totalDeviceActivity = deviceLogs.reduce((sum, log) => sum + (log.count || 0), 0);
  const avgTemperature = sensorLogs.reduce((sum, log) => sum + (log.avgTemperature || 0), 0) / (sensorLogs.filter(l => l.avgTemperature).length || 1);
  const avgHumidity = sensorLogs.reduce((sum, log) => sum + (log.avgHumidity || 0), 0) / (sensorLogs.filter(l => l.avgHumidity).length || 1);
  const totalActiveHours = deviceLogs.reduce((sum, log) => sum + (log.activeHours || 0), 0);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">📊</span>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-sm text-gray-600">Total Activity</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {totalDeviceActivity.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-2">logs in {dateRange} days</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">🌡️</span>
          <Thermometer className="w-5 h-5 text-orange-600" />
        </div>
        <p className="text-sm text-gray-600">Avg Temperature</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {avgTemperature.toFixed(1)}°C
        </p>
        <p className="text-xs text-gray-500 mt-2">last {dateRange} days</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">💧</span>
          <Droplets className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm text-gray-600">Avg Humidity</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {avgHumidity.toFixed(1)}%
        </p>
        <p className="text-xs text-gray-500 mt-2">last {dateRange} days</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">⏱️</span>
          <Calendar className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-sm text-gray-600">Active Hours</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {totalActiveHours.toFixed(1)}h
        </p>
        <p className="text-xs text-gray-500 mt-2">devices running</p>
      </div>
    </div>
  );
}

function DeviceActivityChart({ deviceLogs }) {
  // Group by date and device type
  const chartData = deviceLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = { date: log.date, Light: 0, Fan: 0 };
    }
    acc[log.date][log.deviceType] = (acc[log.date][log.deviceType] || 0) + log.count;
    return acc;
  }, {});

  const data = Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date));
  const maxValue = Math.max(...data.flatMap(d => [d.Light || 0, d.Fan || 0]));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Device Activity Over Time</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <span>Lights</span>
          </div>
          <div className="flex items-center gap-2">
            <Fan className="w-4 h-4 text-blue-600" />
            <span>Fans</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No device activity data available</p>
        </div>
      ) : (
        <div className="relative h-64 flex items-end justify-between gap-2 overflow-hidden">
          {data.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full">
              <div className="w-full flex flex-col-reverse gap-1 h-full justify-start">
                <div
                  className="w-full bg-yellow-500 rounded-t hover:bg-yellow-600 transition cursor-pointer"
                  style={{ height: `${Math.min(((day.Light || 0) / maxValue) * 100, 100)}%` }}
                  title={`Lights: ${day.Light || 0} logs`}
                ></div>
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer"
                  style={{ height: `${Math.min(((day.Fan || 0) / maxValue) * 100, 100)}%` }}
                  title={`Fans: ${day.Fan || 0} logs`}
                ></div>
              </div>
              <span className="text-[10px] text-gray-600 mt-1 whitespace-nowrap">
                {new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SensorReadingsChart({ sensorLogs }) {
  // Group by date
  const tempData = {};
  const humidityData = {};

  sensorLogs.forEach(log => {
    if (log.avgTemperature) {
      if (!tempData[log.date]) tempData[log.date] = [];
      tempData[log.date].push(log.avgTemperature);
    }
    if (log.avgHumidity) {
      if (!humidityData[log.date]) humidityData[log.date] = [];
      humidityData[log.date].push(log.avgHumidity);
    }
  });

  const dates = [...new Set([...Object.keys(tempData), ...Object.keys(humidityData)])].sort();
  const chartData = dates.map(date => ({
    date,
    temp: tempData[date] ? tempData[date].reduce((a, b) => a + b, 0) / tempData[date].length : null,
    humidity: humidityData[date] ? humidityData[date].reduce((a, b) => a + b, 0) / humidityData[date].length : null
  }));

  const maxTemp = Math.max(...chartData.map(d => d.temp || 0));
  const maxHumidity = Math.max(...chartData.map(d => d.humidity || 0));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Environmental Conditions</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Temperature (°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Humidity (%)</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No sensor data available</p>
        </div>
      ) : (
        <div className="h-64 flex items-end justify-between gap-1">
          {chartData.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full relative h-full flex items-end gap-0.5">
                {day.temp && (
                  <div
                    className="flex-1 bg-orange-500 rounded-t hover:bg-orange-600 transition cursor-pointer"
                    style={{ height: `${(day.temp / 40) * 200}px` }}
                    title={`Temp: ${day.temp.toFixed(1)}°C`}
                  ></div>
                )}
                {day.humidity && (
                  <div
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer"
                    style={{ height: `${(day.humidity / 100) * 200}px` }}
                    title={`Humidity: ${day.humidity.toFixed(1)}%`}
                  ></div>
                )}
              </div>
              <span className="text-[10px] text-gray-600 mt-1">
                {new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PeakUsageTimes({ hourlyActivity }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const activityByHour = hours.map(hour => {
    const data = hourlyActivity.find(h => h.hour === hour);
    return {
      hour,
      activity: data?.totalActivity || 0
    };
  });

  const maxActivity = Math.max(...activityByHour.map(h => h.activity));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Usage Times (24h)</h3>

      <div className="space-y-2">
        {activityByHour.filter(h => h.activity > 0).map((data) => {
          const percentage = maxActivity > 0 ? (data.activity / maxActivity) * 100 : 0;
          const isPeak = data.activity === maxActivity && maxActivity > 0;

          return (
            <div key={data.hour} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {String(data.hour).padStart(2, '0')}:00
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-bold">{data.activity}</span>
                  {isPeak && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                      Peak
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${isPeak ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {hourlyActivity.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hourly activity data available</p>
        </div>
      )}
    </div>
  );
}

function RoomUsageChart({ roomUsage }) {
  const topRooms = roomUsage.slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Activity Ranking</h3>

      <div className="space-y-3">
        {topRooms.map((room, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🏠'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{room.room}</p>
                <p className="text-xs text-gray-500">
                  {room.floor} • {room.deviceCount} devices
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-indigo-600">
                {room.activityRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                {room.activeCount} / {room.totalLogs} active
              </p>
            </div>
          </div>
        ))}
      </div>

      {roomUsage.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No room usage data available</p>
        </div>
      )}
    </div>
  );
}
