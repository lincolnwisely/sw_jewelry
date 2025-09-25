export interface Item {
  _id?: string;
  id: string;
  title: string;
  name?: string;  // For consistency between different components
  description: string;
  price: number;
  category: string;
  inStock: number | boolean;  // Can be number for quantity or boolean for availability
  image?: string;  // Legacy single image support - required if no images array
  images?: string[];  // New array of images - required if no image field
  tags: string[];
  quantity?: number;
  materials?: string[];
  createdAt?: string;
}