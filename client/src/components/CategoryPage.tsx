import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_ENDPOINTS, apiCall } from "../config/api.js";
import ProductCard from "./ProductCard.tsx";
import { Item } from "./types";
import Page from "./Page.tsx";

const categoryInfo = {
  rings: {
    title: "Rings",
    description:
      "From rustic .... to everyday stacking bands, find the perfect ring for any occasion.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
  },
  necklaces: {
    title: "Necklaces",
    description:
      "Discover beautiful necklaces from delicate chains to statement pieces that complete any look.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800",
  },
  bracelets: {
    title: "Bracelets",
    description:
      "Thick copper cuffs, intricate wired creations, stackable bangles - choose the perfect finishing touch to your style.",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800",
  },
  earrings: {
    title: "Earrings",
    description:
      "From timeless studs to dramatic drops, find earrings that express your unique style.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800",
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryData = categoryInfo[category as keyof typeof categoryInfo];
  useEffect(() => {
    const fetchCategoryItems = async () => {
      if (!category) return;

      try {
        setLoading(true);
        setError(null);

        const data = await apiCall(
          API_ENDPOINTS.INVENTORY_BY_CATEGORY(category)
        );
        setItems(data.data);
      } catch (err: any) {
        console.error("Error fetching category items:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [category]);

  if (!categoryData) {
    return (
      <Page title="Category Not Found">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Category not found
          </h2>
          <Link
            to="/inventory"
            className="text-black hover:text-gray-800"
          >
            Return to Collection
          </Link>
        </div>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page title={categoryData.title}>
        <div className="text-center">
          Loading {categoryData.title.toLowerCase()}...
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title={categoryData.title}>
        <div className="text-center text-red-600">Error: {error}</div>
      </Page>
    );
  }

  return (
    <Page title={categoryData.title}>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/inventory" className="text-black hover:text-gray-800">
          ← Back to Collection
        </Link>
      </nav>

      {/* Category Header */}
      <div className="mb-12">
        <div className="relative h-48 rounded-lg overflow-hidden mb-6">
          <img
            src={categoryData.image}
            alt={categoryData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">
              {categoryData.title}
            </h1>
          </div>
        </div>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
          {categoryData.description}
        </p>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No {categoryData.title.toLowerCase()} available at the moment.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
