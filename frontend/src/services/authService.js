import { API_ENDPOINTS } from '../config/api';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'access_token';
    this.REFRESH_TOKEN_KEY = 'refresh_token';
    this.USER_KEY = 'user_data';
  }

  // Store tokens in localStorage
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Store user data
  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get user data
  getUser() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Login
  async login(email, password) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens and user data
      this.setTokens(data.tokens.access.token, data.tokens.refresh.token);
      this.setUser(data.user);

      return {
        success: true,
        user: data.user,
        tokens: data.tokens,
      };
    } catch (error) {
      console.error('Login error:', error);

      // Better error messages for different scenarios
      let errorMessage = error.message;
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Signup
  async signup(name, email, password, joinCode) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, joinCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error('This email is already registered');
        } else if (response.status === 400) {
          throw new Error(data.message || 'Invalid join code or missing fields');
        }
        throw new Error(data.message || 'Signup failed');
      }

      // Store tokens and user data
      this.setTokens(data.tokens.access.token, data.tokens.refresh.token);
      this.setUser(data.user);

      return {
        success: true,
        user: data.user,
        tokens: data.tokens,
      };
    } catch (error) {
      console.error('Signup error:', error);

      // Better error messages for different scenarios
      let errorMessage = error.message;
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Logout
  async logout() {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    try {
      if (refreshToken && accessToken) {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Logout request failed:', error.message);
          // Don't throw - we still want to clear local data
        }
      }

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, we still want to clear local auth
      return {
        success: true, // Still return success since we'll clear local data
        message: 'Logged out (server may be unavailable)'
      };
    } finally {
      // Always clear local auth data, even if API call fails
      this.clearAuth();
    }
  }

  // Refresh access token (bonus feature)
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Update access token
      localStorage.setItem(this.TOKEN_KEY, data.tokens.access.token);

      return {
        success: true,
        accessToken: data.tokens.access.token,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear auth if refresh fails
      this.clearAuth();
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new AuthService();
