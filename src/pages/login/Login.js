import React, { useState } from "react";
import "./Login.css";
import avatarImage from "../../Assets/avatar.svg";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/auth/authApiSlice";
import { setCredentials } from "../../slices/auth/authSlice";
import Spinner from "../../components/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading, isError }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide email or password", {
        className: "toast-message",
      });
      return;
    }
    if (isError) {
      toast.error(isError, {
        className: "toast-message",
      });
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      if (res) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error, {
        className: "toast-message",
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const userAdmin = localStorage.getItem("userInfo");
  const admin = JSON.parse(userAdmin);
  const isAdmin = admin?.isAdmin === true;

  if (isAdmin) {
    navigate("/"); // Redirect to home page if user info exists (logged in)
    return null; // Return null to prevent rendering the login form again
  }

  return (
    <div className="login-content">
      {!isAdmin && (
        <form onSubmit={loginSubmit} className="login-form">
          <img src={avatarImage} alt="Avatar" />
          <h2 className="title">Welcome</h2>
          <label htmlFor="email">Email</label>
          <input
            className={isError ? "input_error" : "loginForm_input"}
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            className={isError ? "input_error" : "loginForm_input"}
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
