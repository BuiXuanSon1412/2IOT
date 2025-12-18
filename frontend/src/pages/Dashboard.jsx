import DeviceCard from "../components/DeviceCard";

export default function Dashboard({ devices, setDevices }) {
    const handleToggle = (name) => {
        setDevices(prevDevices =>
            prevDevices.map(device => {
                if (device.name === name) {
                    let newValue = device.value;
                    if (name === "Smart Light") {
                        newValue = device.value === "On" ? "Off" : "On";
                    } else if (name === "Door Lock") {
                        newValue = device.value === "Locked" ? "Unlocked" : "Locked";
                    }
                    return { ...device, value: newValue, status: "Online" };
                }
                return device;
            })
        );
    };

    const onlineCount = devices.filter(d => d.status === 'Online').length;
    const offlineCount = devices.length - onlineCount;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-extrabold text-cyan-400 mb-10 border-b border-slate-700 pb-3">
                    Admin Dashboard
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-cyan-400">
                        <p className="text-sm text-slate-400 font-medium">Total Devices</p>
                        <p className="text-3xl font-bold mt-1">{devices.length}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                        <p className="text-sm text-slate-400 font-medium">Online</p>
                        <p className="text-3xl font-bold mt-1">{onlineCount}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                        <p className="text-sm text-slate-400 font-medium">Offline</p>
                        <p className="text-3xl font-bold mt-1">{offlineCount}</p>
                    </div>
                </div>

                <h3 className="text-2xl font-semibold mb-6">Device Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {devices.map((device) => (
                        <DeviceCard key={device.name} device={device} onToggle={handleToggle} />
                    ))}
                </div>
            </div>
        </div>
    );
}
