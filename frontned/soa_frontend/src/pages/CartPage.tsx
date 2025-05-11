import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_PRODUCT } from "../api/graphqlQueries";
import "../assets/style/HomePage.css";
import "../assets/style/CartPage.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [fetchProductById] = useLazyQuery(GET_PRODUCT, {
    onCompleted: (data) => {
      if (data?.getProduct) {
        setProducts((prev) => [...prev, data.getProduct]);
      }
    },
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    cartItems.forEach((item) => {
      console.log("Fetching product with ID:", item.id);
      fetchProductById({ variables: { id: item.id } });
    });
    // cartItems.forEach((id) => {
    //   fetchProductById({ variables: { id } });
    // });
  }, [cartItems, fetchProductById]);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      {products.length > 0 ? (
        <div className="cart-items">
          {products.map((product) => (
            <div key={product.id} className="cart-item">
              <div className="cart-item-details">
                <h2 className="cart-item-name">{product.name}</h2>
                <p className="cart-item-description">{product.description}</p>
                <p className="cart-item-price">Price: ${product.price}</p>
              </div>
              <button className="cart-item-remove">Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="cart-empty">
          <p>Your cart is currently empty.</p>
          <button className="cart-shop-button">Continue Shopping</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
