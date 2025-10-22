import react from 'react';

export default function Devices() {
    return (
        <div className="w-full p-10 text-white">
        <h2 className="text-3xl font-bold mb-4">System Settings</h2>
        <p>Manage user accounts, network preferences, and security settings here.</p>
        <div className="mt-8 p-6 bg-slate-800 rounded-xl">
             <p className="text-slate-400">Security: Two-Factor Authentication (Enabled).</p>
        </div>
    </div>
    );
}