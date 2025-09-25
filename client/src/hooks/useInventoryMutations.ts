import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS, apiCall } from '../config/api';
import { Item } from '../components/types';

// Custom hook for creating a product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Omit<Item, '_id'>): Promise<Item> => {
      const token = localStorage.getItem('sw_jewelry_token');

      const response = await apiCall(API_ENDPOINTS.INVENTORY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      return response.data;
    },
    onSuccess: () => {
      // Automatically refresh all inventory-related queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    }
  });
}

// Custom hook for deleting a product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string): Promise<void> => {
      const token = localStorage.getItem('sw_jewelry_token');

      await apiCall(API_ENDPOINTS.INVENTORY_BY_ID(productId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      // Automatically refresh all inventory-related queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      // You could add toast notifications here
    }
  });
}