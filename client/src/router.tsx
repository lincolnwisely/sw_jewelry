import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './components/inventory';
import DetailPage from './components/details';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Sharon Wisely Jewelry
            </h1>
            <p className="text-lg text-gray-600">
              Discover our beautiful collection of handcrafted jewelry.
            </p>
          </div>
        )
      },
      {
        path: '/inventory',
        element: <Inventory />
      },
      {
        path: '/inventory/:id',
        element: <DetailPage />
      }
    ]
  }
]); 