import DeviceTabs from './DeviceTabs'
export function DHT22Config({ device }) {
  return (
    <DeviceTabs tabs={{
      Basic: (
        <div>
          🌡 {device.temperature}°C | 💧 {device.humidity}%
        </div>
      ),
      Advanced: (
        <label>
          Alert Threshold
          <input type="number" defaultValue={device.alertTemp} className="input" />
        </label>
      ),
      Log: <pre>{JSON.stringify(device.logs, null, 2)}</pre>,
    }} />
  );
}
