import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, apiCall } from '../config/api';
import { Item } from '../components/types';

// Custom hook for fetching inventory
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