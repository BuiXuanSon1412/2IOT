import DeviceTabs from './DeviceTabs';

export function FanConfig({ device }) {
  return (
    <DeviceTabs tabs={{
      Basic: (
        <>
          <label>Speed</label>
          <select className="input">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </>
      ),
      Advanced: <input className="input" defaultValue={device.maxRPM} />,
      History: <pre>{JSON.stringify(device.logs, null, 2)}</pre>,
    }} />
  );
}
