import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class LogApiService {
  constructor() {
    this.TIMEOUT_MS = 15000; // 15 seconds for analytics
  }

  async fetchWithAuth(url, options = {}) {
    const token = authService.getAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Content-Type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        const text = await response.text();
        console.error('Response text:', text.substring(0, 200));
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Log API Error:', error);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out. Please try again.',
        };
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to server.',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get logs by date range
  async getLogsByDateRange(startDate, endDate, sourceType = null) {
    let url = `${API_BASE_URL}/api/logs?startDate=${startDate}&endDate=${endDate}`;
    if (sourceType) {
      url += `&sourceType=${sourceType}`;
    }
    return this.fetchWithAuth(url);
  }

  // Get logs by source ID
  async getLogsBySource(sourceId, limit = 100) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/logs/source/${sourceId}?limit=${limit}`
    );
  }

  // Get aggregated device logs
  async getAggregatedDeviceLogs(startDate, endDate) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/logs/analytics/devices?startDate=${startDate}&endDate=${endDate}`
    );
  }

  // Get aggregated sensor logs
  async getAggregatedSensorLogs(startDate, endDate) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/logs/analytics/sensors?startDate=${startDate}&endDate=${endDate}`
    );
  }

  // Get hourly device activity
  async getHourlyDeviceActivity(startDate, endDate) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/logs/analytics/hourly?startDate=${startDate}&endDate=${endDate}`
    );
  }

  // Get device usage by room
  async getDeviceUsageByRoom(startDate, endDate) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/logs/analytics/rooms?startDate=${startDate}&endDate=${endDate}`
    );
  }

  // Helper: Get date range for last N days
  getDateRange(days = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }
}

export default new LogApiService();
