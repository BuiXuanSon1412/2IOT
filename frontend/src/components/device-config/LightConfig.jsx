import DeviceTabs from './DeviceTabs';

export function LightConfig({ device }) {
  return (
    <DeviceTabs
      tabs={{
        Basic: (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Status</label>
              <select className="input">
                <option>On</option>
                <option>Off</option>
              </select>
            </div>

            <div>
              <label>Brightness (%)</label>
              <input type="range" min="0" max="100" defaultValue={device.brightness} />
            </div>
          </div>
        ),

        Advanced: (
          <div className="space-y-3">
            <label>Auto-off Timer (min)</label>
            <input type="number" defaultValue={device.autoOff} className="input" />
          </div>
        ),

        Log: (
          <ul className="text-sm text-gray-600 space-y-1">
            {device.logs.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        ),
      }}
    />
  );
}
