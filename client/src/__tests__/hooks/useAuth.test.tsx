import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock API calls
vi.mock('../../config/api', () => ({
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
    }
  },
  apiCall: vi.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // Initially loading while checking auth status
    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.isAuthenticated).toBe(false);
    expect(result.current.state.user).toBe(null);
  });

  it('should provide auth methods', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.checkAuthStatus).toBe('function');
  });

  it('should handle login success', async () => {
    const { apiCall } = await import('../../config/api');
    const mockUser = {
      _id: '123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'customer'
    };

    // Mock successful login
    (apiCall as any).mockResolvedValueOnce({
      success: true,
      data: { user: mockUser }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await result.current.login('test@example.com', 'password123');

    await waitFor(() => {
      expect(result.current.state.isAuthenticated).toBe(true);
      expect(result.current.state.user?.email).toBe('test@example.com');
    });
  });

  it('should handle logout', async () => {
    const { apiCall } = await import('../../config/api');

    (apiCall as any).mockResolvedValueOnce({
      success: true,
      message: 'Logged out successfully'
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // Set authenticated state first
    result.current.state.isAuthenticated = true;
    result.current.state.user = { _id: '123' } as any;

    await result.current.logout();

    await waitFor(() => {
      expect(result.current.state.isAuthenticated).toBe(false);
      expect(result.current.state.user).toBe(null);
    });
  });
});
