import react from 'react';

export default function Devices() {
    return (
        <div className="w-full p-10 text-white">
            <h2 className="text-3xl font-bold mb-4">Device Management</h2>
            <p>This section will allow detailed control and configuration for all connected devices.</p>
            <div className="mt-8 p-6 bg-slate-800 rounded-xl">
                <p className="text-slate-400">Current active devices: 4. Check back later for advanced settings.</p>
            </div>
        </div>
    );
}