import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_ENDPOINTS, apiCall } from "../config/api";
import { Item } from "./types";
import { useCart } from "../context/CartContext.tsx";

interface DetailProps {
  item?: Item;
}

export default function Detail(props: DetailProps = {}) {
  const _item = props.item;
  //get id from route to fetch itemif not provided in props
  const { id } = useParams();
  const isPreview = _item;
  const { addToCart, setCartOpen } = useCart();

  const [item, setItem] = useState(_item ? _item : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiCall(API_ENDPOINTS.INVENTORY_BY_ID(id));
        setItem(data.data);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!item || !item._id) {
      fetchItem();
    } else {
      setLoading(false);
    }
  }, [id, item]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-600" };
    if (stock <= 3)
      return { text: `Only ${stock} left`, color: "text-orange-600" };
    return { text: "In Stock", color: "text-green-600" };
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      rings: "bg-gray-100 text-gray-800",
      bracelets: "bg-blue-100 text-blue-800",
      necklaces: "bg-pink-100 text-pink-800",
      earrings: "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const stockStatus = getStockStatus(item.inStock);

  const handleAddToCart = () => {
    addToCart(item);
    setCartOpen(true); // Open cart panel when item is added
  };

  if (isPreview) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
        <p className="text-xl font-bold">{formatPrice(item.price)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/inventory" className="text-black hover:text-gray-800">
          ← Back to Collection
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                item.category
              )}`}
            >
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>

          <div className="text-3xl font-bold text-gray-900">
            {formatPrice(item.price)}
          </div>

          <div className={`text-lg font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              {item.description}
            </p>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
                item.inStock > 0
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={item.inStock === 0}
            >
              {item.inStock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            <button className="w-full py-3 px-6 rounded-lg border border-black text-black hover:bg-gray-50 text-lg font-medium transition-colors">
              Add to Wishlist
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Product Details
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Category</dt>
                <dd className="font-medium capitalize">{item.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Availability</dt>
                <dd className="font-medium">{item.inStock} in stock</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Item ID</dt>
                <dd className="font-medium">{item.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
