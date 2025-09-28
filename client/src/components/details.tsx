import { useParams, Link } from "react-router-dom";
import { Item } from "./types";
import { useCart } from "../context/CartContext.tsx";
import { useInventoryById } from "../hooks/useInventory";

interface DetailProps {
  item?: Item;
}

export default function Detail(props: DetailProps = {}) {
  const { item: _item } = props;
  const { id } = useParams();
  const isPreview = !!_item;
  const { addToCart, setCartOpen } = useCart();

  // Use the hook only if we don't have a preview item
  const { data: fetchedItem = null, isLoading: loading, error } = useInventoryById(
    isPreview ? '' : (id || '')
  );

  // Use the preview item if available, otherwise use the fetched item
  const item = _item || fetchedItem;

  if (loading && !isPreview) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }
  if (error && !isPreview) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading product</div>
          <p className="text-gray-600">{error?.message || 'Something went wrong'}</p>
          <Link
            to="/inventory"
            className="mt-4 inline-block text-black hover:text-gray-800"
          >
            ← Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Product not found</div>
          <Link
            to="/inventory"
            className="text-black hover:text-gray-800"
          >
            ← Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStockStatus = (stock: number | boolean) => {
    const stockNum = typeof stock === 'boolean' ? (stock ? 1 : 0) : stock;
    if (stockNum === 0) return { text: "Out of Stock", color: "text-orange-100" };
    if (stockNum <= 3)
      return { text: `Only ${stockNum} left`, color: "text-orange-600" };
    return { text: "In Stock", color: "text-green-600" };
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
          src={item?.images ? item.images[0] : item.image}
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
          src={item?.images ? item.images[0] : item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800`}
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
                (typeof item.inStock === 'boolean' ? item.inStock : item.inStock > 0)
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={typeof item.inStock === 'boolean' ? !item.inStock : item.inStock === 0}
            >
              {(typeof item.inStock === 'boolean' ? item.inStock : item.inStock > 0) ? "Add to Cart" : "Out of Stock"}
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
                <dd className="font-medium">
                  {typeof item.inStock === 'boolean'
                    ? (item.inStock ? 'In Stock' : 'Out of Stock')
                    : `${item.inStock} in stock`
                  }
                </dd>
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
