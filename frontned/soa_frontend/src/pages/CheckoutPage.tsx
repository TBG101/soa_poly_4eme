import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "../api/graphqlQueries";
import React, { useState } from "react";
import "../assets/style/CheckoutPage.css";

const CheckoutPage: React.FC = () => {
  const [createOrder] = useMutation(CREATE_ORDER);

  const [message, setMessage] = useState<string | null>(null);

  const handleCreateOrder = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) {
      setMessage("Your cart is empty.");
      return;
    }

    const products = cart.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity || 1,
    }));

    try {
      const { data } = await createOrder({ variables: { products } });
      if (data?.createOrder?.id) {
        setMessage("Order created successfully!");
        localStorage.removeItem("cart");
      } else {
        setMessage("Failed to create order. Please try again.");
      }
    } catch (err: any) {
      setMessage(
        err?.message ||
          err?.graphQLErrors?.[0]?.message ||
          "Failed to create order. Please try again."
      );
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout Page</h1>
      <button onClick={handleCreateOrder} className="checkout-button">
        Place Order
      </button>
      {message && <p className="checkout-message">{message}</p>}
    </div>
  );
};

export default CheckoutPage;
