import { useState } from 'react';
import { Users, Shield, Key, Bell, Globe, Palette, Database, Lock, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { mockDeviceDetails } from '../data/mockData';

// ============= USER MANAGEMENT (ADMIN ONLY) =============

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@smarthome.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-06-20',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-08-10',
      lastLogin: '3 hours ago'
    }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Administrator access required</p>
        </div>
      </div>
    );
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600 mt-1">Manage resident accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onAdd={(newUser) => {
            setUsers([...users, { ...newUser, id: users.length + 1 }]);
            setShowAddUser(false);
          }}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setEditingUser(null);
          }}
        />
      )}

      {/* User List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Users can only control devices you give them permission to access. Configure permissions in the Device Permissions tab.
        </p>
      </div>
    </div>
  );
}

// Add User Modal
function AddUserModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="user">User (Resident)</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit User Modal
function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="user">User (Resident)</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============= DEVICE PERMISSIONS (ADMIN ONLY) =============

function DevicePermissions({ currentUser, devices }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState({
    2: { // John Doe
      'fan-living01-001': true,
      'light-living01-001': true,
      'light-bedroom01-001': true,
      'dht22-living01-001': false // sensors view-only by default
    },
    3: { // Sarah Smith
      'light-bedroom02-001': true,
      'fan-bedroom02-001': true,
      'dht22-bedroom02-001': false
    }
  });

  const users = [
    { id: 2, name: 'John Doe', email: 'john@example.com' },
    { id: 3, name: 'Sarah Smith', email: 'sarah@example.com' }
  ];

  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Administrator access required</p>
        </div>
      </div>
    );
  }

  const togglePermission = (userId, deviceId) => {
    setPermissions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [deviceId]: !prev[userId]?.[deviceId]
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Device Permissions</h3>
        <p className="text-sm text-gray-600 mt-1">Control which devices each user can access</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select User</label>
        <select
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Choose a user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <p className="font-semibold text-gray-900">
              Device Access for: {users.find(u => u.id === selectedUser)?.name}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {Object.values(devices).map(device => {
              const hasPermission = permissions[selectedUser]?.[device.id] || false;
              const isReadOnly = device.type === 'dht22' || device.type === 'mq2' || device.type === 'bh1750';
              const Icon = device.iconComponent;

              return (
                <div key={device.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${hasPermission ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${hasPermission ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{device.name}</p>
                        <p className="text-sm text-gray-500">
                          {device.room} • {device.type.toUpperCase()}
                          {isReadOnly && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">View Only</span>}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPermission}
                        onChange={() => togglePermission(selectedUser, device.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
              Save Permissions
            </button>
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Select a user to manage their device permissions</p>
        </div>
      )}
    </div>
  );
}

// ============= ACCOUNT SETTINGS =============

function AccountSettings({ currentUser }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={currentUser.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={currentUser.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= NOTIFICATIONS =============

function NotificationSettings() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <SettingToggle
          label="Device Alerts"
          description="Get notified when devices change state or require attention"
          defaultChecked={true}
        />
        <SettingToggle
          label="Security Alerts"
          description="Immediate notifications for security-related events"
          defaultChecked={true}
        />
        <SettingToggle
          label="Energy Reports"
          description="Weekly energy consumption and cost reports"
          defaultChecked={true}
        />
        <SettingToggle
          label="System Updates"
          description="Notifications about system updates and maintenance"
          defaultChecked={false}
        />
        <SettingToggle
          label="Email Notifications"
          description="Receive notifications via email"
          defaultChecked={true}
        />
        <SettingToggle
          label="Push Notifications"
          description="Receive push notifications on mobile devices"
          defaultChecked={true}
        />
      </div>
    </div>
  );
}

// ============= SYSTEM PREFERENCES =============

function SystemPreferences() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option>English (US)</option>
              <option>Vietnamese</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option>Asia/Ho_Chi_Minh (GMT+7)</option>
              <option>America/New_York (GMT-5)</option>
              <option>Europe/London (GMT+0)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temperature Unit</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option>Celsius (°C)</option>
              <option>Fahrenheit (°F)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Data</h3>
        <div className="space-y-4">
          <SettingToggle
            label="Usage Analytics"
            description="Help improve the system by sharing anonymous usage data"
            defaultChecked={true}
          />
          <SettingToggle
            label="Location Services"
            description="Enable location-based automation and geofencing"
            defaultChecked={true}
          />
          <SettingToggle
            label="Cloud Backup"
            description="Automatically backup device configurations to cloud"
            defaultChecked={true}
          />
        </div>
      </div>
    </div>
  );
}

// ============= HELPER COMPONENTS =============

function SettingToggle({ label, description, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
}

// ============= MAIN SETTINGS SCREEN =============

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('account');

  // Mock current user - in real app, this would come from auth context
  const [currentUser] = useState({
    id: 1,
    name: 'Admin User',
    email: 'admin@smarthome.com',
    role: 'admin' // or 'user'
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: Users, adminOnly: false },
    { id: 'users', label: 'User Management', icon: Shield, adminOnly: true },
    { id: 'permissions', label: 'Device Permissions', icon: Key, adminOnly: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, adminOnly: false },
    { id: 'system', label: 'System', icon: Globe, adminOnly: false },
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || currentUser.role === 'admin');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Account, permissions, and system preferences</p>
      </div>

      {/* Role Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
        <Shield className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-semibold text-purple-900">
          Logged in as: {currentUser.role === 'admin' ? '👑 Administrator' : '👤 User'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${activeTab === tab.id
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'account' && <AccountSettings currentUser={currentUser} />}
        {activeTab === 'users' && <UserManagement currentUser={currentUser} />}
        {activeTab === 'permissions' && <DevicePermissions currentUser={currentUser} devices={mockDeviceDetails} />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'system' && <SystemPreferences />}
      </div>
    </div>
  );
}
