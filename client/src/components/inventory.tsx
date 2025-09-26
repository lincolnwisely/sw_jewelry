import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard.tsx";
import { Item } from "./types";
import Page from "./Page.tsx";
import { useInventory } from "../hooks/useInventory";
import { getCategoriesArray } from "../constants/categories";

export default function Inventory() {
  // Replace manual state with useQuery hook
  const { data: inventory, isLoading: loading, error } = useInventory();

  const [filteredInventory, setFilteredInventory] = useState<Item[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";

  // Filter and search functionality
  useEffect(() => {
    if (!inventory) {
      setFilteredInventory(null);
      return;
    }

    let filtered = [...inventory];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error?.message || 'Failed to load inventory'}</div>;
  }

  if (!inventory) {
    return <div>No inventory found</div>;
  }

  const categories = getCategoriesArray();

  const displayedItems = filteredInventory || inventory;
  const totalItems = displayedItems?.length || 0;

  return (
    <Page title={searchTerm ? `Search Results for "${searchTerm}"` : "Collection"}>
      {/* Search Results Header */}
      {searchTerm && (
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Found {totalItems} result{totalItems !== 1 ? 's' : ''} for "<strong>{searchTerm}</strong>"
          </p>
        </div>
      )}

      {/* Show category grid only if no search term */}
      {!searchTerm && (
        <div className="mb-12">
          {/* <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Discover our exquisite collection of handcrafted jewelry, featuring
            rings, necklaces, bracelets, and earrings made with the finest
            materials.
          </p> */}

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {totalItems} item{totalItems !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchTerm ? 'Search Results' : 'Collection'}
        </h2>
      </div>

      {displayedItems && displayedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedItems.map((item: Item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No items found' : 'No items available'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `Try searching for something else or browse our categories.`
              : 'Check back later for new items.'
            }
          </p>
        </div>
      )}
    </Page>
  );
}
