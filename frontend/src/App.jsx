
import React, { useState } from 'react';
import AuthScreen from './screens/AuthScreen';
import MonitorScreen from './screens/MonitorScreen';
import ConfigurationScreen from './screens/ConfigurationScreen';
import SettingsScreen from './screens/SettingsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import Sidebar from './components/Sidebar';
import { mockFloors, mockDevices } from './data/mockData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('monitor');

  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        onLogout={() => setIsAuthenticated(false)}
      />
      <main className="flex-1 overflow-auto">
        {currentScreen === 'monitor' && <MonitorScreen devices={mockDevices} floors={mockFloors} />}
        {currentScreen === 'configuration' && <ConfigurationScreen devices={mockDevices} />}
        {currentScreen === 'analytics' && <AnalyticsScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </main>
    </div>
  );
}

export default App;

