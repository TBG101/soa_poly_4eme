import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../assets/style/HomePage.css";

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

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

    // Close mobile menu on route change
    setIsMenuOpen(false);

    return () => {
      window.removeEventListener("storage", updateUsername);
      window.removeEventListener("auth-changed", updateUsername);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.dispatchEvent(new Event("auth-changed"));
    setUsername(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        E-Commerce
      </Link>

      {/* Hamburger menu for mobile */}
      <div className="navbar-mobile-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/cart"
            className={location.pathname === "/cart" ? "active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            Cart
          </Link>
        </li>
        <li>
          <Link
            to="/checkout"
            className={location.pathname === "/checkout" ? "active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            Checkout
          </Link>
        </li>
        <li>
          <Link
            to="/orders"
            className={location.pathname === "/orders" ? "active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            Orders
          </Link>
        </li>
      </ul>

      <div className={`navbar-auth ${isMenuOpen ? "active" : ""}`}>
        {username ? (
          <>
            <span>Welcome, {username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={location.pathname === "/signup" ? "active" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
