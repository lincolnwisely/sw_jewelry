import logo from './logo.svg';
import './App.css';
import Detail from './components/details.tsx';
import Placeholder from './components/placeholder.tsx';
import { createBrowserRouter, Routes, Route } from 'react-router-dom';
import Inventory from './components/inventory.tsx';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Placeholder />,
  },
  // {
  //   path: "/about",
  //   element: <About />,
  // },
  {
    path: "/inventory/:id",
    element: <Detail />,
    loader: async ({ params }) => {
      // Load inventory data based on params.id
      return fetch(`/api/inventory/${params.id}`);
    },
  },
  {
    path: "/inventory/",
    element: <Inventory />,
    loader: async ({ params }) => {
      // Load all inventory data
      return fetch(`/api/inventory/`);
    },
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
