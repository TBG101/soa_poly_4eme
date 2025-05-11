import "./App.css";
import "./pages/global.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { setContext } from "@apollo/client/link/context";
import { createHttpLink } from "@apollo/client";
import AdminProductsPage from "./pages/AdminProductsPage";
import OrderPage from "./pages/OrderPage";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql", // Replace with your GraphQL endpoint
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

// Removed <Router> from App.tsx since it is already provided in main.tsx.
function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
