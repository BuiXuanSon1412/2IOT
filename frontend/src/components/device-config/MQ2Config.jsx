import DeviceTabs from './DeviceTabs';

export function MQ2Config({ device }) {
  return (
    <DeviceTabs tabs={{
      Basic: <div>Gas Level: {device.gasLevel}</div>,
      Advanced: <input className="input" defaultValue={device.sensitivity} />,
      History: <pre>{JSON.stringify(device.logs, null, 2)}</pre>,
    }} />
  );
}
