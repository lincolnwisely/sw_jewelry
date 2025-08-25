import { Link } from "react-router-dom";
import { Item } from "./types";

interface ProductCardProps {
  item: Item;
}

export default function ProductCard({ item }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Out of Stock
        </span>
      );
    }
    if (stock <= 3) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
          Low Stock
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        In Stock
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      rings: "bg-purple-100 text-purple-800",
      bracelets: "bg-blue-100 text-blue-800",
      necklaces: "bg-pink-100 text-pink-800",
      earrings: "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Link
      to={`/inventory/${item.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
              item.category
            )}`}
          >
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
          {getStockBadge(item.inStock)}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(item.price)}
          </span>

          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center">
              <span className="text-xs text-gray-500">
                {item.tags.slice(0, 2).join(" • ")}
                {item.tags.length > 2 && "..."}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
