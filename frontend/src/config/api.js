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
    UPDATE_CHARACTERISTIC: `${API_BASE_URL}/api/devices/characteristic`,
    UPDATE_PERMISSION: `${API_BASE_URL}/api/devices/permission`,
    AUTO_BEHAVIOR: {
      CREATE: `${API_BASE_URL}/api/devices/auto-behavior/create`,
      REMOVE: `${API_BASE_URL}/api/devices/auto-behavior/remove`,
    },
    SCHEDULES: {
      CREATE: `${API_BASE_URL}/api/devices/schedules/create`,
      REMOVE: `${API_BASE_URL}/api/devices/schedules/remove`,
    },
  },
  SENSORS: {
    GET_ALL: `${API_BASE_URL}/api/sensors`,
    ADD: `${API_BASE_URL}/api/sensors`,
  },
  USERS: {
    GET_ALL: `${API_BASE_URL}/api/users`,
    ADD: `${API_BASE_URL}/api/users`,
    UPDATE_ROLE: `${API_BASE_URL}/api/users/role`,
    DELETE: `${API_BASE_URL}/api/users`,
    CREATE_ADMIN: `${API_BASE_URL}/api/users/admin/create`,
  },
  BOARD: {
    CONTROL: `${API_BASE_URL}/api/board/control`,
  }
};

export default API_BASE_URL;
