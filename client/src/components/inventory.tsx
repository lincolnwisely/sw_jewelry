import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS, apiCall } from "../config/api";
import ProductCard from "./ProductCard.tsx";
import { Item } from "./types";
import Page from "./Page.tsx";

export default function Inventory() {
  const [inventory, setInventory] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiCall(API_ENDPOINTS.INVENTORY);
        setInventory(data.data);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!inventory) {
    return <div>No inventory found</div>;
  }

  const categories = [
    {
      name: "rings",
      title: "Rings",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300",
      description: "Engagement rings, wedding bands, and fashion rings",
    },
    {
      name: "necklaces",
      title: "Necklaces",
      image:
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=300",
      description: "Pendants, chains, and statement necklaces",
    },
    {
      name: "bracelets",
      title: "Bracelets",
      image:
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300",
      description: "Tennis bracelets, bangles, and charm bracelets",
    },
    {
      name: "earrings",
      title: "Earrings",
      image:
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=300",
      description: "Studs, hoops, and drop earrings",
    },
  ];

  return (
    <Page title="Our Collection">
      <div className="mb-12">
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Discover our exquisite collection of handcrafted jewelry, featuring
          rings, necklaces, bracelets, and earrings made with the finest
          materials.
        </p>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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

      {/* Featured Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Featured Products
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventory &&
          inventory.map((item: Item) => (
            <ProductCard key={item.id} item={item} />
          ))}
      </div>
    </Page>
  );
}
