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
import RecentProductsGrid from './components/RecentProductsGrid.tsx';
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
                Sharon Wisely
              </h1>

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

            {/* Recent Products Grid */}
            <RecentProductsGrid />
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
