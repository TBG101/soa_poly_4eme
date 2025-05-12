import "./App.css";
import "./pages/global.css";
import "./assets/style/animations.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { Routes, Route, useLocation } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SEND_LOGS } from "./api/graphqlQueries";

import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OrderPage from "./pages/OrderPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Navbar from "./components/Navbar";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AppWithProviders />
    </ApolloProvider>
  );
}

// ✅ Now both hooks are used inside the Apollo and Router context
function AppWithProviders() {
  const location = useLocation();
  const [sendLogs] = useMutation(SEND_LOGS);

  useEffect(() => {
    sendLogs({
      variables: {
        level: "info",
        message: `Route changed to ${location.pathname}`,
        source: `frontend ${location.pathname}`,
      },
    }).catch(console.error);
  }, [location, sendLogs]);

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </>
  );
}

const AdminPage = () => (
  <div className="container">
    <div className="card">
      <h1>Admin Dashboard</h1>
      <div className="grid" style={{ marginTop: "2rem" }}>
        <div className="card">
          <h3>Product Management</h3>
          <p>Add, edit, or remove products from your inventory</p>
          <a href="/admin/products" className="btn">
            Manage Products
          </a>
        </div>
        <div className="card">
          <h3>Analytics</h3>
          <p>View sales data and customer insights</p>
          <a href="/admin/analytics" className="btn">
            View Reports
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default App;
