import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiCall } from '../config/api';
import { Item } from '../components/types';

// Custom hook for fetching all inventory
export function useInventory() {
  return useQuery({
    queryKey: ['inventory'], // Unique identifier for this query
    queryFn: async (): Promise<Item[]> => {
      const response = await apiCall(API_ENDPOINTS.INVENTORY);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes after component unmounts
  });
}

// Custom hook for fetching inventory by category
export function useInventoryByCategory(category: string) {
  return useQuery({
    queryKey: ['inventory', 'category', category], // Hierarchical cache key
    queryFn: async (): Promise<Item[]> => {
      const response = await apiCall(`${API_ENDPOINTS.INVENTORY}/category/${category}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
    enabled: !!category, // Only run query if category is provided
  });
}

// Custom hook for fetching inventory by id
export function useInventoryById(id: string) {
  return useQuery({
    queryKey: ['inventory', 'id', id], // Hierarchical cache key
    queryFn: async (): Promise<Item> => {
      const response = await apiCall(API_ENDPOINTS.INVENTORY_BY_ID(id));
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
    enabled: !!id, // Only run query if category is provided
  });
}

// Custom hook for fetching recent products
export function useRecentProducts(limit: number = 8) {
  return useQuery({
    queryKey: ['inventory', 'recent', limit], // Cache key includes limit
    queryFn: async (): Promise<Item[]> => {
      const response = await apiCall(API_ENDPOINTS.INVENTORY);
      const items = response.data as Item[];

      // Sort by creation date (most recent first) and take the specified limit
      return items
        .sort((a, b) => {
          // If createdAt exists, use it; otherwise use _id (MongoDB ObjectId contains timestamp)
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, limit);
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
  });
}