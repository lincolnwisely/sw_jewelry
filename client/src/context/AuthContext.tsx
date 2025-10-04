import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { API_ENDPOINTS, apiCall } from '../config/api';

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
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start loading to check auth status on mount
  error: null
};

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
        isAuthenticated: true
      });
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
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
  login: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check if we have a valid cookie by calling the /me endpoint
      const response = await apiCall(API_ENDPOINTS.AUTH.ME, {
        method: 'GET'
      });

      if (response.success && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user
          }
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);

      // Handle unauthorized errors
      if (error.message === 'UNAUTHORIZED') {
        dispatch({ type: 'LOGOUT' });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string): Promise<User> => {
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

      if (response.success && response.data?.user) {
        console.log('Login successful, user:', response.data.user);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user
          }
        });

        // Return the user data so the caller can access role immediately
        return response.data.user;
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

      if (response.success && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user
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
      // Call logout endpoint to clear the HttpOnly cookie
      await apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local state
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    checkAuthStatus
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