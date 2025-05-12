import React, { useState } from "react";
import "../assets/style/HomePage.css";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_LIST } from "../api/graphqlQueries";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

const HomePage: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { loading, error, data } = useQuery<{
    getProductList: { products: Product[] };
  }>(GET_PRODUCT_LIST, {
    variables: { page: 1, limit: 10, search: "" },
  });

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isDuplicate = cart.some(
      (cartItem: Product) => cartItem.id === product.id
    );

    if (!isDuplicate) {
      const updatedCart = [...cart, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setToastMessage(`${product.name} added to cart!`);
    } else {
      setToastMessage(`${product.name} is already in your cart!`);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()} className="btn">
          Try Again
        </button>
      </div>
    );
  return (
    <div className="homepage-container fade-in">
      <header className="homepage-header slide-up">
        <h1 className="homepage-title">Welcome to Our Store</h1>
        <p className="homepage-description">
          Discover the best products at unbeatable prices.
        </p>
 
      </header>

      <main>
        <div className="featured-section slide-up">
          <h2>Featured Products</h2>
          <div className="product-list stagger-list">
            {Array.isArray(data?.getProductList?.products) &&
            data.getProductList.products.length > 0 ? (
              data.getProductList.products.map((product) => (
                <div key={product.id} className="product-item scale-on-hover">
                  <div className="product-image-placeholder"></div>
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-description">{product.description}</p>
                  <div className="product-badges">
                    <span className="product-badge product-badge-new">New</span>
                    {product.price < 50 && (
                      <span className="product-badge product-badge-sale">
                        On Sale
                      </span>
                    )}
                  </div>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <div className="product-actions">
                    <button
                      className="add-to-cart-button"
                      onClick={() => addToCart(product)}
                    >
                      <span className="product-button-icon">🛒</span>
                      Add to Cart
                    </button>
                    <button
                      className="view-details-button"
                      onClick={() =>
                        (window.location.href = `/product/${product.id}`)
                      }
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products fade-in">
                <p>No products available at this time.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showToast && <div className="toast-message">{toastMessage}</div>}
    </div>
  );
};

export default HomePage;
