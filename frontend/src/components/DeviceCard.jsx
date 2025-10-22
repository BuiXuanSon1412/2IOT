export default function DeviceCard({ device, onToggle }) {
  const isOnline = device.status === "Online";
  const statusColor = isOnline ? "bg-green-500" : "bg-red-500";
  const toggleable = device.name === "Smart Light" || device.name === "Door Lock";
  const icon = device.name.includes("Light") ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-9.95 10.15L2 22h20l-.05-9.85A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-8-8c0-2.31 1.05-4.47 2.85-5.94a1 1 0 0 1 1.25.13l1.16 1.16a1 1 0 0 0 1.41 0l.7-.7A1 1 0 0 1 11 6.5V11h2V6.5a1 1 0 0 1 .59-.92l.7.7a1 1 0 0 0 1.41 0l1.16-1.16A8 8 0 0 1 20 12a8 8 0 0 1-8 8z" /></svg>
  ) : device.name.includes("Temperature") || device.name.includes("Humidity") ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5a3 3 0 0 0-3 3v6.5a4.5 4.5 0 1 0 6 0V8a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1v6.5a2.5 2.5 0 1 1-2 0V8a1 1 0 0 1 1-1z" /></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a10 10 0 0 0-9 5.5V23h18V6.5a10 10 0 0 0-9-5.5zm0 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7zm0-10a3 3 0 1 0-3-3 3 3 0 0 0 3 3z" /></svg>
  );

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <div className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor} text-white`}>
          {device.status}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{device.name}</h3>
      <p className="text-4xl font-extrabold text-cyan-400 mb-4">{device.value}</p>

      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${statusColor}`}></div>
        <span className="text-sm text-slate-400">{isOnline ? "Operational" : "Disconnected"}</span>
      </div>

      {toggleable && (
        <button
          onClick={() => onToggle(device.name)}
          className="mt-4 w-full py-2 bg-teal-600 rounded-lg text-white font-medium hover:bg-teal-700 transition duration-200 shadow-md"
        >
          {device.value === 'On' || device.value === 'Locked' ? 'Turn Off / Unlock' : 'Turn On / Lock'}
        </button>
      )}
    </div>
  );
}
