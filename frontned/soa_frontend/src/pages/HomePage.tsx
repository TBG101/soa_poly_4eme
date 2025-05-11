import React from "react";
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
  const { loading, error, data } = useQuery<{
    getProductList: { products: Product[] };
  }>(GET_PRODUCT_LIST, {
    variables: { page: 1, limit: 10, search: "" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="homepage-title">Welcome to Our Store</h1>
        <p className="homepage-description">
          Discover the best products at unbeatable prices.
        </p>
      </header>
      <main className="product-list">
        {Array.isArray(data?.getProductList?.products) ? (
          data.getProductList.products.map((product) => (
            <div key={product.id} className="product-item">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className="product-price">Price: ${product.price}</p>
              <button
                onClick={() => {
                  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                  const isDuplicate = cart.some(
                    (cartItem: Product) => cartItem.id === product.id
                  );
                  if (!isDuplicate) {
                    const updatedCart = [...cart, product];
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                  }
                }}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
