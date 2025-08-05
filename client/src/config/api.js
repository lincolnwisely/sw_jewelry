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
  return 'https://your-deployed-api.com';
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  INVENTORY: `${API_BASE_URL}/api/inventory`,
  INVENTORY_BY_ID: (id) => `${API_BASE_URL}/api/inventory/${id}`,
  INVENTORY_BY_CATEGORY: (category) => `${API_BASE_URL}/api/inventory/category/${category}`,
  INVENTORY_STATS: `${API_BASE_URL}/api/inventory/stats`,
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 