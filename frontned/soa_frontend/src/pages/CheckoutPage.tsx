import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "../api/graphqlQueries";
import React, { useState } from "react";
import "../assets/style/CheckoutPage.css";

const CheckoutPage: React.FC = () => {
  const [createOrder] = useMutation(CREATE_ORDER, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    },
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    const storedCart = localStorage.getItem("cart");
    if (!storedCart) {
      setMessage("Your cart is empty.");
      return;
    }

    const cartItems = JSON.parse(storedCart);
    const products = cartItems.map(
      (item: { id: string; quantity: number }) => ({
        productId: item.id,
        quantity: item.quantity,
      })
    );

    try {
      const { data } = await createOrder({ variables: { products } });
      if (data?.createOrder) {
        setMessage("Order created successfully!");
        localStorage.removeItem("cart");
      }
    } catch {
      setMessage("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout Page</h1>
      <button onClick={handleCheckout} className="checkout-button">
        Place Order
      </button>
      {message && <p className="checkout-message">{message}</p>}
    </div>
  );
};

export default CheckoutPage;
