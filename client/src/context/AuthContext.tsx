import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { API_ENDPOINTS, apiCall, tokenUtils } from '../config/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
  createdAt: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Check if we have a stored token to initialize state appropriately
const getInitialState = (): AuthState => {
  const hasStoredToken = !!localStorage.getItem('sw_jewelry_token');

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: hasStoredToken, // Only show loading if we have a token to verify
    error: null
  };
};

const initialState: AuthState = getInitialState();

function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log('Auth reducer - action:', action.type, action);
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      console.log('AUTH_SUCCESS reducer - setting auth state:', {
        user: action.payload.user,
        token: action.payload.token ? 'exists' : 'null',
        isAuthenticated: true
      });
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
  isTokenExpired: () => boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'sw_jewelry_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up automatic token expiration check
  useEffect(() => {
    if (!state.token) return;

    const timeUntilExpiration = tokenUtils.getTimeUntilExpiration(state.token);

    if (timeUntilExpiration <= 0) {
      // Token is already expired
      dispatch({ type: 'LOGOUT' });
      return;
    }

    // Set timeout to automatically logout when token expires
    const timeoutId = setTimeout(() => {
      console.log('Token expired automatically, logging out...');
      dispatch({ type: 'LOGOUT' });
    }, timeUntilExpiration);

    return () => clearTimeout(timeoutId);
  }, [state.token]);

  // Store token in localStorage when it changes
  useEffect(() => {
    if (state.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, state.token);
    } else if (state.token === null && !state.loading) {
      // Only remove token if we're not loading (to prevent removal during initialization)
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [state.token, state.loading]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!storedToken) {
        // Only set loading false if we're not already authenticated
        // This prevents StrictMode double-invocation from breaking auth
        if (!state.isAuthenticated) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
        return;
      }

      // Check if token is expired before making API call
      if (tokenUtils.isTokenExpired(storedToken)) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        dispatch({ type: 'LOGOUT' });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Verify token with backend
      const response = await apiCall(API_ENDPOINTS.AUTH.ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (response.success && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user,
            token: storedToken
          }
        });
      } else {
        // Invalid token
        localStorage.removeItem(AUTH_TOKEN_KEY);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);

      // Handle specific expiration errors
      if (error.message === 'EXPIRED_TOKEN' || error.message === 'UNAUTHORIZED') {
        dispatch({ type: 'LOGOUT' });
      }

      localStorage.removeItem(AUTH_TOKEN_KEY);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.isAuthenticated]);

  // Check if user is authenticated on app start
  useEffect(() => {
    // Add a small delay to ensure localStorage is stable
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response:', response);

      if (response.success && response.data?.user && response.data?.token) {
        console.log('Login successful, storing token and user:', response.data.user);
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token
          }
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during login';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.success && response.data?.user && response.data?.token) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token
          }
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during registration';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate server-side session
      if (state.token) {
        await apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local state
      localStorage.removeItem(AUTH_TOKEN_KEY);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const isTokenExpired = () => {
    return tokenUtils.isTokenExpired(state.token);
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    checkAuthStatus,
    isTokenExpired
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}