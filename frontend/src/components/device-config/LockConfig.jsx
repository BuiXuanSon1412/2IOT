import DeviceTabs from './DeviceTabs';

export function LockConfig({ device }) {
  return (
    <DeviceTabs tabs={{
      Basic: (
        <select className="input">
          <option>Locked</option>
          <option>Unlocked</option>
        </select>
      ),
      Advanced: <input className="input" defaultValue={device.autoLock} />,
      History: <pre>{JSON.stringify(device.logs, null, 2)}</pre>,
    }} />
  );
}
