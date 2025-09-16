// API Configuration for different environments
const getApiUrl = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production fallback (update with your deployed URL)
  return 'https://server-bold-resonance-8209.fly.dev';
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  INVENTORY: `${API_BASE_URL}/api/inventory`,
  INVENTORY_BY_ID: (id) => `${API_BASE_URL}/api/inventory/${id}`,
  INVENTORY_BY_CATEGORY: (category) => `${API_BASE_URL}/api/inventory/category/${category}`,
  INVENTORY_STATS: `${API_BASE_URL}/api/inventory/stats`,
  
  // Authentication endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
  }
};

// JWT token utilities
export const tokenUtils = {
  // Check if token is expired
  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  },

  // Get token expiration date
  getTokenExpiration: (token) => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiration: (token) => {
    const expiration = tokenUtils.getTokenExpiration(token);
    if (!expiration) return 0;

    return expiration.getTime() - Date.now();
  }
};

// Helper function for API calls with automatic token handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage for protected routes
    const token = localStorage.getItem('sw_jewelry_token');

    // Check if we have a token and if it's expired
    if (token && tokenUtils.isTokenExpired(token)) {
      // Clear expired token
      localStorage.removeItem('sw_jewelry_token');

      // Trigger logout if this is a protected route
      if (options.headers?.Authorization || endpoint.includes('/auth/me')) {
        throw new Error('EXPIRED_TOKEN');
      }
    }

    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      // Clear any stored token
      localStorage.removeItem('sw_jewelry_token');
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 