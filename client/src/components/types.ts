export interface Item {
  _id?: string;
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  image: string;
  tags: string[];
}