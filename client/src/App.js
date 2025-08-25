import logo from './logo.svg';
import './App.css';
import Detail from './components/details.tsx';
import Layout from './components/Layout.tsx';
import CategoryPage from './components/CategoryPage.tsx';
import { createBrowserRouter, Routes, Route } from 'react-router-dom';
import Inventory from './components/inventory.tsx';


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
              Welcome to Sharon Wisely Jewelry
            </h1>
            <p className="text-lg text-gray-600">
              Discover our beautiful collection of handcrafted jewelry.
            </p>
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
    ],
  },
]);

function App() {
  return (
    <div className="App p-4">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Routes>
      <Route path="/inventory/" component={Inventory}/>

        <Route path="/inventory/:id" component={Detail}/>
      </Routes>

      
    </div>
  );
}

export default App;
