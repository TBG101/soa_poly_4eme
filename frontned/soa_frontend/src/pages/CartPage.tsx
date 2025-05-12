import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GET_PRODUCT } from "../api/graphqlQueries";
import "../assets/style/HomePage.css";
import "../assets/style/CartPage.css";
import "../assets/style/animations.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  quantity?: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [fetchProductById] = useLazyQuery(GET_PRODUCT, {
    onCompleted: (data) => {
      if (data?.getProduct) {
        const foundItem = cartItems.find(
          (item) => item.id === data.getProduct.id
        );
        const product = {
          ...data.getProduct,
          quantity: foundItem?.quantity || 1,
        };

        setProducts((prev) => {
          const exists = prev.some((p) => p.id === product.id);
          if (!exists) {
            return [...prev, product];
          }
          return prev;
        });
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Add quantity to each item if not present
      const cartWithQuantity = parsedCart.map((item: Product) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCartItems(cartWithQuantity);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      setProducts([]); // Reset products before fetching
      setLoading(true);
      cartItems.forEach((item) => {
        fetchProductById({ variables: { id: item.id } });
      });
    } else if (cartItems.length === 0) {
      setProducts([]);
      setLoading(false);
    }
  }, [cartItems, fetchProductById]);

  const handleRemove = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    navigate("/checkout");
  };
  if (loading)
    return (
      <div className="loading-container fade-in">
        <div className="spinner"></div>
        <p className="slide-up">Loading your cart...</p>
      </div>
    );
  return (
    <div className="cart-container fade-in">
      <h1 className="cart-title slide-up">Your Shopping Cart</h1>

      {products.length > 0 ? (
        <>
          <div className="cart-items stagger-list">
            {products.map((product) => (
              <div key={product.id} className="cart-item scale-on-hover">
                <div
                  className="cart-item-image"
                  aria-label={`Image of ${product.name}`}
                ></div>
                <div className="cart-item-details">
                  <h2 className="cart-item-name">{product.name}</h2>
                  <p className="cart-item-description">{product.description}</p>
                  <p className="cart-item-price">${product.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, (product.quantity || 1) - 1)
                      }
                    >
                      -
                    </button>
                    <span>{product.quantity || 1}</span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, (product.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => handleRemove(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary slide-up">
            <h2>Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal:</span>
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
              className="cart-checkout-button pulse"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="cart-empty fade-in">
          <p>Your cart is currently empty.</p>
          <p>Looks like you haven't added any products yet!</p>
          <Link to="/" className="cart-shop-button pulse">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
