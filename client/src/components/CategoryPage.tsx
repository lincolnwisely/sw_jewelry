import { useParams, Link } from "react-router-dom";
import ProductCard from "./ProductCard.tsx";
import Page from "./Page.tsx";
import { useInventoryByCategory } from "../hooks/useInventory";
import { categoryInfo } from "../constants/categories";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  // Replace manual fetch with useQuery hook
  const { data: items = [], isLoading: loading, error } = useInventoryByCategory(category || '');

  const categoryData = categoryInfo[category as keyof typeof categoryInfo];

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
        <div className="text-center text-red-600">Error: {error?.message || 'Failed to load category items'}</div>
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
