import React, { type ReactNode, useState, useRef, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import Cart from "./Cart.tsx";
import { useAuth } from "../context/AuthContext.tsx";
interface LayoutProps {
  children?: ReactNode;
}

function CartButton() {
  const { toggleCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="text-gray-500 hover:text-gray-900 transition-colors relative"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 2h2m0 0h8m-8 0v8a2 2 0 002 2h6a2 2 0 002-2v-8"
        />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

function UserMenu() {
  const { logout, state } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  // Show sign in/register links if not authenticated
  if (!state.isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Show user menu if authenticated
  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-500 hover:text-gray-900 transition-colors flex items-center space-x-2"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="hidden sm:inline">
          {state.user?.firstName || "Account"}
        </span>
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
        >
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              Hello, {state.user?.firstName}!
            </div>
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
            <Link
              to="/orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              My Orders
            </Link>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="md:text-xl font-semibold text-gray-900 hover:underline"
              >
                Sharon Wisely Jewelry
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search jewelry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </form>
            </div>

            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                className={`transition-colors ${
                  isActive("/")
                    ? "text-black underline font-medium"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/inventory"
                className={`transition-colors ${
                  isActive("/inventory")
                    ? "text-black underline font-medium"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Collection
              </Link>

              {/* Category Dropdown */}
              <div className="relative group hidden md:block">
                <button className="text-gray-500 hover:text-gray-900 transition-colors flex items-center">
                  Categories
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/category/rings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      Rings
                    </Link>
                    <Link
                      to="/category/necklaces"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      Necklaces
                    </Link>
                    <Link
                      to="/category/bracelets"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      Bracelets
                    </Link>
                    <Link
                      to="/category/earrings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      Earrings
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <CartButton />
                <UserMenu />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 grow content-center">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2025 Sharon Wisely Jewelry. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Cart Sliding Panel */}
      <Cart />
    </div>
  );
}
