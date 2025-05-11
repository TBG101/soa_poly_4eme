import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/style/HomePage.css";

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      // Simulate fetching the username from the token or an API
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Assuming JWT
      setUsername(decodedToken.username);
    }
  }, []);

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
          <span>Welcome, {username}</span>
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
