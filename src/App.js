import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Users,
  Orders,
  Categories,
  Products,
  AddProduct,
  AddCategory,
  EditProduct,
  User,
  Order,
  Login,
  AddSubCat,
  Dashboard,
  Category,
  EditCategory,
  EditSubCat,
} from './pages';
import Sidebar from './components/sidebar/Sidebar';
import Product from './pages/Product Pages/Product';

const paths = [
  { path: '/login', element: <Login /> },
  { path: '/', element: <Dashboard /> },
  { path: '/users', element: <Users /> },
  { path: '/users/:userId', element: <User /> },
  { path: '/orders', element: <Orders /> },
  { path: '/orders/:orderId', element: <Order /> },
  { path: '/categories', element: <Categories /> },
  { path: '/categories/add', element: <AddCategory /> },
  { path: '/category/:id', element: <Category /> },
  { path: '/edit-category/:id', element: <EditCategory /> },
  { path: '/add-sub-category', element: <AddSubCat /> },
  { path: '/category/:id/edit-sub-category/:subCatId', element: <EditSubCat /> },
  { path: '/products', element: <Products /> },
  { path: '/product/:id', element: <Product /> },
  { path: '/products/add', element: <AddProduct /> },
  { path: '/products/edit/:id', element: <EditProduct /> },
];

function App() {
  const userInfo = localStorage.getItem('userInfo');
  const admin = JSON.parse(userInfo);
  const isLockedInAsAdmin = admin?.isAdmin === true;

  const PrivateRoute = ({ element, ...rest }) => {
    if (!userInfo || !isLockedInAsAdmin) {
      return <Navigate to="/login" />;
    }

    return <Route {...rest} element={element} />;
  };

  return (
    <Router>
      <div className="App">
        {isLockedInAsAdmin && <Sidebar />}
        <Routes>
          {paths.map(({ path, element }) => (
            <PrivateRoute key={path} path={path} element={element} />
          ))}
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="toast-message"
          style={{ width: '10vw' }}
        />
      </div>
    </Router>
  );
}

export default App;
