import DeviceTabs from './DeviceTabs';

export function BH1750Config({ device }) {
  return (
    <DeviceTabs tabs={{
      Basic: <div>Lux: {device.lux}</div>,
      Advanced: <input className="input" defaultValue={device.pollInterval} />,
      History: <pre>{JSON.stringify(device.logs, null, 2)}</pre>,
    }} />
  );
}
