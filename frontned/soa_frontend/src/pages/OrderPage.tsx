import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDERS_BY_USER_ID } from "../api/graphqlQueries";
import { useNavigate } from "react-router-dom";
import styles from "./OrderPage.module.css";

interface Order {
  id: string;
  products: { productId: string; quantity: number }[];
  price: number;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  // Check for auth token
  const token = localStorage.getItem("auth-token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const { loading, error, data } = useQuery(GET_ORDERS_BY_USER_ID, {
    skip: !token,
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    if (data?.getOrdersByUserId) {
      setOrders(data.getOrdersByUserId);
    }
  }, [data]);

  if (!token) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles["order-container"]}>
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <div className={styles["order-list"]}>
          {orders.map((order) => (
            <div key={order.id} className={styles["order-item"]}>
              <h2>Order ID: {order.id}</h2>
              <p>Total Price: ${order.price}</p>
              <ul>
                {order.products.map((product, index) => (
                  <li key={index}>
                    Product ID: {product.productId}, Quantity:{" "}
                    {product.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default OrderPage;
