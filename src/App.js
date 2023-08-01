import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,useHistory
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
  const history = useHistory(); // Get access to the history object

  // State to track admin login status
  const [isLockedInAsAdmin, setIsLockedInAsAdmin] = useState(false);

  // Function to check admin status and update the state
  const checkAdminStatus = () => {
    const userInfo = localStorage.getItem("userInfo");
    const admin = JSON.parse(userInfo);
    setIsLockedInAsAdmin(admin?.isAdmin === true);
  };

  useEffect(() => {
    // Run the checkAdminStatus function when the component mounts
    checkAdminStatus();

    // Listen for route changes and run the checkAdminStatus function
    const unlisten = history.listen(() => {
      checkAdminStatus();
    });

    // Clean up the listener when the component unmounts
    return () => {
      unlisten();
    };
  }, [history]); // Pass history as a dependency to rerun the effect when it changes


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
