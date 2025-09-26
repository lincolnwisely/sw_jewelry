import { Link } from 'react-router-dom';
import { useRecentProducts } from '../hooks/useInventory';
import { Item } from './types';

export default function RecentProductsGrid() {
  const { data: recentProducts = [], isLoading, error } = useRecentProducts(8);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="mt-6 sm:mt-8 px-2 sm:px-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading recent products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 sm:mt-8 px-2 sm:px-4">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading recent products</p>
        </div>
      </div>
    );
  }

  if (recentProducts.length === 0) {
    return (
      <div className="mt-6 sm:mt-8 px-2 sm:px-4">
        <div className="text-center py-8">
          <p className="text-gray-600">No products available yet</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for new items!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {recentProducts.map((product: Item) => (
            <Link
              key={product.id || product._id}
              to={`/inventory/${product.id || product._id}`}
              className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product?.images && product.images.length > 0 ? product.images[0] : product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-black transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </p>
                <p className="font-bold text-gray-900 text-sm">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/inventory"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View All Products
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}