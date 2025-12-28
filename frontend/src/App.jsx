import React, { useState, useEffect } from 'react';
import AuthScreen from './screens/AuthScreen';
import MonitorScreen from './screens/MonitorScreen';
import ConfigurationScreen from './screens/ConfigurationScreen';
import SettingsScreen from './screens/SettingsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import Sidebar from './components/Sidebar';
import authService from './services/authService';
import { mockFloors, mockDeviceDetails } from './data/mockData';
import { bootstrapSocket } from './services/socketService';

function App() {
  // websocket
  bootstrapSocket();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('monitor');
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const user = authService.getUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('monitor');
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <main className="flex-1 overflow-auto">
        {currentScreen === 'monitor' && <MonitorScreen devices={mockDeviceDetails} floors={mockFloors} />}
        {currentScreen === 'configuration' && <ConfigurationScreen devices={mockDeviceDetails} />}
        {currentScreen === 'analytics' && <AnalyticsScreen />}
        {currentScreen === 'settings' && <SettingsScreen currentUser={currentUser} />}
      </main>
    </div>
  );
}

export default App;
