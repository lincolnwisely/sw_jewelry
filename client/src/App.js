import logo from './logo.svg';
import './App.css';
import Detail from './components/details.tsx';
import Layout from './components/Layout.tsx';
import CategoryPage from './components/CategoryPage.tsx';
import { createBrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Inventory from './components/inventory.tsx';
import RegisterForm from './components/RegisterForm.tsx';
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
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sharon Wisely Jewelry
            </h1>
            <br/>
            <p className="text-lg text-gray-600 m-4 p-4">
              Handcrafted necklaces, earring, rings and bracelets out of copper, sterling silver and gemstones.</p>
              
              <p className='text-lg text-gray-600 m-4 p-4'> This site is in-progress. &nbsp; 
                <a className="underline hover:" href="https://www.etsy.com/shop/SharonWiselyJewelry" target="_blank" rel="noreferrer noopener">View past sales on Etsy</a>.</p>
              
              {/* Photo Gallery */}
              <div className="mt-8 px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                    <div key={num} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                      <img
                        src={`/images/${num}.jpeg`}
                        alt={`Jewelry piece ${num}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
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
      }
    ],
  },
]);

function App() {
  return (
    <div className="App p-4">
      <header className="App-header">

    
      </header>
      <Routes>
      <Route path="/inventory/" component={Inventory}/>

        <Route path="/inventory/:id" component={Detail}/>
      </Routes>

      
    </div>
  );
}

export default App;
