import React, { type ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sharon Wisely Jewelry
              </h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </a>
              <a
                href="/inventory"
                className="text-gray-500 hover:text-gray-900"
              >
                Inventory
              </a>
              <a href="/about" className="text-gray-500 hover:text-gray-900">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2024 Sharon Wisely Jewelry. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
