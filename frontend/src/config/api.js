const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  DEVICES: {
    GET_ALL: `${API_BASE_URL}/api/devices`,
    ADD: `${API_BASE_URL}/api/devices`,
    DELETE: `${API_BASE_URL}/api/devices`,
    UPDATE_STATUS: `${API_BASE_URL}/api/devices/status`,
  },
  SENSORS: {
    GET_ALL: `${API_BASE_URL}/api/sensors`,
  },
  BOARD: {
    CONTROL: `${API_BASE_URL}/api/board/control`,
  }
};

export default API_BASE_URL;
