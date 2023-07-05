import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  RiDashboardLine,
  RiShoppingCart2Line,
  RiUser3Line,
  RiAddFill,
  RiFileList3Line,
} from "react-icons/ri";
import { IoIosLaptop } from "react-icons/io";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../slices/auth/authApiSlice";
import { toast } from "react-toastify";
import { removeCredentials } from "../../slices/auth/authSlice";
import Spinner from "../spinner/Spinner";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };

  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(removeCredentials());
      navigate("/login");
      toast.POSITION.TOP_CENTER("You have successfully Logout");
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    navigate("/login");
  }, []);

  if (isLoading) {
    <Spinner />;
  }

  const [showSideBar, setShowSideBar] = useState(true);

  const styleNavBar = {
    display: showSideBar ? "none" : "block",
    width: showSideBar ? "100px" : "200px",
    transition: "width 60s ease",
  };
  const styleNavBarWidth = {
    width: showSideBar ? "70px" : "300px",
  };
  return (
    <div style={styleNavBarWidth} className="sidebar-parent-div">
      <div className="sidebar-content-div">
        <div className="sidebar-logo-div">
          {/* <img style={styleNavBar} src={logo} alt="LOGO" />
          <h4 style={styleNavBar}>My Shop</h4> */}
          <div className="sidebar-logo-icons">
            {showSideBar ? (
              <AiOutlineMenuUnfold onClick={() => setShowSideBar(!Sidebar)} />
            ) : (
              <AiOutlineMenuFold
                onClick={() => setShowSideBar((prevState) => !prevState)}
              />
            )}
          </div>
        </div>
        <div className="sidebar-links-div">
          <Link to="/" className="sidebar-link">
            <div className={`sidebar-item ${isActive("/") && "active"}`}>
              <RiDashboardLine className="sidebar-icon" />
              <p style={styleNavBar}>Dashboard</p>
            </div>
          </Link>
          <Link to="/categories" className="sidebar-link">
            <div
              className={`sidebar-item ${isActive("/categories") && "active"}`}
            >
              <RiFileList3Line className="sidebar-icon" />

              <p style={styleNavBar}>Product Categories</p>
            </div>
          </Link>
          <Link to="/categories/add" className="sidebar-link">
            <div
              className={`sidebar-item ${
                isActive("/categories/add") && "active"
              }`}
            >
              <RiAddFill className="sidebar-icon" />
              <p style={styleNavBar}>Add Category</p>
            </div>
          </Link>
          <Link to="/add-sub-category" className="sidebar-link">
            <div
              className={`sidebar-item ${
                isActive("/add-sub-category") && "active"
              }`}
            >
              <RiAddFill className="sidebar-icon" />
              <p style={styleNavBar}>Add Sub Category</p>
            </div>
          </Link>
          <Link to="/products" className="sidebar-link">
            <div
              className={`sidebar-item ${isActive("/products") && "active"}`}
            >
              <IoIosLaptop className="sidebar-icon" />
              <p style={styleNavBar}>Products</p>
            </div>
          </Link>
          <Link to="/products/add" className="sidebar-link">
            <div
              className={`sidebar-item ${
                isActive("/products/add") && "active"
              }`}
            >
              <RiAddFill className="sidebar-icon" />
              <p style={styleNavBar}>Add Product</p>
            </div>
          </Link>
          <Link to="/orders" className="sidebar-link">
            <div className={`sidebar-item ${isActive("/orders") && "active"}`}>
              <RiShoppingCart2Line className="sidebar-icon" />
              <p style={styleNavBar}>Orders</p>
            </div>
          </Link>
          <Link to="/users" className="sidebar-link">
            <div className={`sidebar-item ${isActive("/users") && "active"}`}>
              <RiUser3Line className="sidebar-icon" />
              <p style={styleNavBar}>Users</p>
            </div>
          </Link>
        </div>
        <div className="sidebar-footer-div">
          {userInfo ? (
            <Link onClick={handleLogout}>
              <button className="sidebar-footer-btn" style={styleNavBar}>
                Logout
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="sidebar-footer-btn" style={styleNavBar}>
                Login
              </button>
            </Link>
          )}

          <p style={styleNavBar}>© Copyright MyShop Inc.</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
