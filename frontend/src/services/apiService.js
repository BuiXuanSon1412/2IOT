import { API_ENDPOINTS } from '../config/api';
import authService from './authService';

class ApiService {
  constructor() {
    this.TIMEOUT_MS = 10000; // 10 seconds
  }
  // Helper method to make authenticated requests
  async fetchWithAuth(url, options = {}) {
    const token = authService.getAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // ADD TIMEOUT LOGIC
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal, // ADD THIS
      });

      clearTimeout(timeoutId); // ADD THIS

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId); // ADD THIS
      console.error('API Error:', error);

      // ADD TIMEOUT ERROR HANDLING
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out. Please check your connection.',
        };
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to server. Please check your connection.',
        };
      }

      // Handle 401 - token expired
      if (error.message.includes('401')) {
        authService.clearAuth();
        window.location.href = '/';
        return {
          success: false,
          error: 'Session expired. Please login again.',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }


  // ============= DEVICE SERVICES =============

  async getAllDevices() {
    return this.fetchWithAuth(API_ENDPOINTS.DEVICES.GET_ALL, {
      method: 'GET',
    });
  }

  async addDevices(devices) {
    // Ensure devices is an array
    const devicesList = Array.isArray(devices) ? devices : [devices];

    return this.fetchWithAuth(API_ENDPOINTS.DEVICES.ADD, {
      method: 'POST',
      body: JSON.stringify({ devices: devicesList }),
    });
  }

  async deleteDevices(ids) {
    // Ensure ids is an array
    const idsList = Array.isArray(ids) ? ids : [ids];

    return this.fetchWithAuth(API_ENDPOINTS.DEVICES.DELETE, {
      method: 'DELETE',
      body: JSON.stringify({ ids: idsList }),
    });
  }

  async toggleDeviceStatus(deviceId, newStatus) {
    return this.fetchWithAuth(API_ENDPOINTS.DEVICES.UPDATE_STATUS, {
      method: 'PATCH',
      body: JSON.stringify({ _id: deviceId, newStatus }),
    });
  }

  async updateDeviceCharacteristics(deviceId, characteristics) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.UPDATE_CHARACTERISTIC}`, {
      method: 'PATCH',
      body: JSON.stringify({ _id: deviceId, characteristics }),
    });
  }

  async updateDevicePermission(userId, deviceName, permissionLevel) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL}/permission`, {
      method: 'PATCH',
      body: JSON.stringify({ userId, name: deviceName, permissionLevel }),
    });
  }

  async addAutoBehavior(deviceName, measure, range, action) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL}/auto-behavior/create`, {
      method: 'PATCH',
      body: JSON.stringify({ name: deviceName, measure, range, action }),
    });
  }

  async removeAutoBehavior(deviceName, measure, range, action) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL}/auto-behavior/remove`, {
      method: 'PATCH',
      body: JSON.stringify({ name: deviceName, measure, range, action }),
    });
  }

  async addSchedule(deviceName, cronExpression, action) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL}/schedules/create`, {
      method: 'PATCH',
      body: JSON.stringify({ name: deviceName, cronExpression, action }),
    });
  }

  async removeSchedule(deviceName, cronExpression, action) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL}/schedules/remove`, {
      method: 'PATCH',
      body: JSON.stringify({ name: deviceName, cronExpression, action }),
    });
  }

  // ============= SENSOR SERVICES =============

  async getAllSensors() {
    return this.fetchWithAuth(API_ENDPOINTS.SENSORS.GET_ALL, {
      method: 'GET',
    });
  }

  async addSensors(sensors) {
    // Ensure sensors is an array
    const sensorsList = Array.isArray(sensors) ? sensors : [sensors];

    return this.fetchWithAuth(API_ENDPOINTS.SENSORS.GET_ALL, {
      method: 'POST',
      body: JSON.stringify({ sensors: sensorsList }),
    });
  }

  // ============= BOARD CONTROL =============

  async sendControlCommand(deviceName, action) {
    return this.fetchWithAuth(API_ENDPOINTS.BOARD.CONTROL, {
      method: 'POST',
      body: JSON.stringify({ name: deviceName, action }),
    });
  }

  // ============= USER SERVICES =============

  async getAllUsers() {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL.replace('devices', 'users')}`, {
      method: 'GET',
    });
  }

  async addUser(name, email, password) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL.replace('devices', 'users')}`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async updateUserRole(userId, newRole) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL.replace('devices', 'users')}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ userId, newRole }),
    });
  }

  async deleteUser(userId) {
    return this.fetchWithAuth(`${API_ENDPOINTS.DEVICES.GET_ALL.replace('devices', 'users')}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }
}

export default new ApiService();
