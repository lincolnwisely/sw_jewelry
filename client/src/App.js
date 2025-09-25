import './App.css';
import Detail from './components/details.tsx';
import Layout from './components/Layout.tsx';
import CategoryPage from './components/CategoryPage.tsx';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import Inventory from './components/inventory.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import LoginPage from './components/LoginPage.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AdminInventory from './components/AdminInventory.tsx';
import AddProduct from './components/AddProduct.tsx';
import { useAuth } from './context/AuthContext.tsx';

// Register page component that can use hooks
function RegisterPage() {
  const { register, state } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = userData;

      await register(registrationData);
      // Redirect to home page after successful registration
      navigate('/');
    } catch (error) {
      // Error is handled by the AuthContext and passed through state.error
      console.error('Registration failed:', error);
    }
  };
console.log("state',", state)
  return (
    <RegisterForm 
      onSubmit={handleRegister}
      loading={state.loading}
      error={state.error}
    />
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <div className="text-center py-6 sm:py-12 px-4 sm:px-6">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
                Sharon Wisely Jewelry
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 mx-auto max-w-2xl px-2 sm:px-4 mb-4 sm:mb-6">
                Handcrafted necklaces, earrings, rings and bracelets out of copper, sterling silver and gemstones.
              </p>

              <p className="text-xs sm:text-sm md:text-base text-gray-600 mx-auto max-w-xl px-2 sm:px-4 mb-6 sm:mb-8">
                This site is in-progress.{" "}
                <a
                  className="underline hover:text-black transition-colors"
                  href="https://www.etsy.com/shop/SharonWiselyJewelry"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  View past sales on Etsy
                </a>
                .
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="mt-6 sm:mt-8 px-2 sm:px-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 max-w-7xl mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                  <div
                    key={num}
                    className="aspect-square overflow-hidden rounded-md sm:rounded-lg shadow-sm sm:shadow-md hover:shadow-lg transition-shadow duration-200 bg-gray-100"
                  >
                    <img
                      src={`/images/${num}.jpeg`}
                      alt={`Jewelry piece ${num}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/inventory/:id",
        element: <Detail />,
      },
      {
        path: "/category/:category",
        element: <CategoryPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          {
            path: "",
            element: <AdminDashboard />
          },
          {
            path: "inventory",
            element: <AdminInventory />
          },
          {
            path: "inventory/new",
            element: <AddProduct />
          },
          // We'll add more admin routes here later
          // { path: "orders", element: <AdminOrders /> },
          // { path: "users", element: <AdminUsers /> },
        ],
      }
    ],
  },
]);

function App() {
  return (
    <div className="App p-4">
      <header className="App-header">


      </header>
    </div>
  );
}

export default App;
