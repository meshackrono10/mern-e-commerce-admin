import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
} from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/sidebar/Sidebar";
import Product from "./pages/Product Pages/Product";
import { useEffect, useState } from "react";

const paths = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/:userId",
    element: <User />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/orders/:orderId",
    element: <Order />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/categories/add",
    element: <AddCategory />,
  },
  {
    path: "/category/:id",
    element: <Category />,
  },
  {
    path: "/edit-category/:id",
    element: <EditCategory />,
  },
  {
    path: "/add-sub-category",
    element: <AddSubCat />,
  },
  {
    path: "/category/:id/edit-sub-category/:subCatId",
    element: <EditSubCat />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
  {
    path: "/products/add",
    element: <AddProduct />,
  },
  {
    path: "/products/edit/:id",
    element: <EditProduct />,
  },

  // { path: "*", element: <NotFound /> },
];

function App() {
  const [isLockedInAsAdmin, setIsLockedInAsAdmin] = useState(false); // State to track admin login status

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const admin = JSON.parse(userInfo);
    setIsLockedInAsAdmin(admin?.isAdmin === true); // Update the state based on admin status
  }, []);

  const Layout = () => {
    return (
      <>
        <Sidebar />
        <Routes>
          {paths.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </>
    );
  };

  return (
    <Router>
      {!isLockedInAsAdmin ? ( // Use a conditional operator to show content if not locked in
        <div className="App">
          <Layout />
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
            style={{ width: "10vw" }}
          />
        </div>
      ) : (
        <Navigate to="/login" /> // Redirect to login page if locked in
      )}
    </Router>
  );
}

export default App;
