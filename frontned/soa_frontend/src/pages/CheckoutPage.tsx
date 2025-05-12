import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "../api/graphqlQueries";
import React, { useState, useEffect } from "react";
import "../assets/style/CheckoutPage.css";
import "../assets/style/animations.css";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const [createOrder] = useMutation(CREATE_ORDER);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart items from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Calculate order totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) {
      setMessage({ text: "Your cart is empty.", type: "error" });
      setIsLoading(false);
      return;
    }

    const products = cart.map((item: CartItem) => ({
      productId: item.id,
      quantity: item.quantity || 1,
    }));

    try {
      const { data } = await createOrder({ variables: { products } });
      if (data?.createOrder?.id) {
        setMessage({ text: "Order created successfully!", type: "success" });
        localStorage.removeItem("cart");
        setIsOrderComplete(true);
        setTimeout(() => {
          navigate("/"); // Redirect to homepage after successful order
        }, 5000);
      } else {
        setMessage({
          text: "Failed to create order. Please try again.",
          type: "error",
        });
      }
    } catch (err: unknown) {
      const error = err as Error & { graphQLErrors?: { message: string }[] };
      setMessage({
        text:
          error?.message ||
          error?.graphQLErrors?.[0]?.message ||
          "Failed to create order. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isOrderComplete) {
    return (
      <div className="checkout-container fade-in">
        <div className="order-complete slide-up">
          <div className="order-complete-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="#4CAF50"
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <h2>Order Complete!</h2>
          <p>
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <button
            className="checkout-button pulse"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container fade-in">
      <h1 className="checkout-title slide-up">Checkout</h1>
      <p className="checkout-description slide-up">
        Review your order and click the button below to complete your purchase.
      </p>

      <form onSubmit={handleCreateOrder} className="checkout-simplified">
        <div className="checkout-summary slide-up">
          <h2>Order Summary</h2>
          <div className="cart-summary-row">
            <span>Items ({cartItems.length}):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Tax (7%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="cart-summary-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="checkout-button pulse"
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner"
                  style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></span>
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </form>

      {message && (
        <p className={`checkout-message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
};

export default CheckoutPage;
