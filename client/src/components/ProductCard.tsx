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

  return (
    <Link
      to={`/inventory/${item.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={item?.images && item.images.length > 0 ? item.images[0] : item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full  bg-gray-100 text-gray-800`}
          >
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(item.price)}
          </span>

        </div>
      </div>
    </Link>
  );
}
