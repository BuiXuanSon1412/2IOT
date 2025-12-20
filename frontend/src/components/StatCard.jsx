
export function StatCard({ icon, label, value, status }) {
  const statusColors = {
    optimal: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
      <div className={`inline-flex p-2 rounded-lg ${statusColors[status]}`}>{icon}</div>
      <p className="text-gray-600 text-sm mt-2">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
