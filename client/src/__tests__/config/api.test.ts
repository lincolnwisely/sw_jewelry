import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiCall, API_BASE_URL } from '../../config/api';

// Mock fetch
global.fetch = vi.fn();

describe('API Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('apiCall', () => {
    it('should include credentials in fetch requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiCall('/test-endpoint');

      expect(global.fetch).toHaveBeenCalledWith(
        '/test-endpoint',
        expect.objectContaining({
          credentials: 'include', // This is the key security feature!
        })
      );
    });

    it('should set Content-Type header', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiCall('/test-endpoint');

      expect(global.fetch).toHaveBeenCalledWith(
        '/test-endpoint',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle 401 errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(apiCall('/test-endpoint')).rejects.toThrow('UNAUTHORIZED');
    });

    it('should handle other HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(apiCall('/test-endpoint')).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('API_BASE_URL', () => {
    it('should be defined', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
    });
  });
});
