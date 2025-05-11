import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style/HomePage.css";

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUsername = () => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUsername(decodedToken.username);
        } catch {
          setUsername(null);
        }
      } else {
        setUsername(null);
      }
    };

    updateUsername();

    window.addEventListener("storage", updateUsername);
    window.addEventListener("auth-changed", updateUsername);

    return () => {
      window.removeEventListener("storage", updateUsername);
      window.removeEventListener("auth-changed", updateUsername);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.dispatchEvent(new Event("auth-changed"));
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">E-Commerce</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
        <li>
          <Link to="/checkout">Checkout</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
      </ul>

      <div className="navbar-auth">
        {username ? (
          <>
            <span>Welcome, {username}</span>
            <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
