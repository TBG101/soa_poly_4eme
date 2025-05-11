import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../api/graphqlQueries";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { username, password } });
      const token = data?.login?.token;
      if (token) {
        // Save token to localStorage
        localStorage.setItem("auth-token", token);
        // Dispatch custom event
        window.dispatchEvent(new Event("auth-changed"));
        // Navigate to the dashboard or another page
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
      {error && <p className="error-message">Error: {error.message}</p>}
    </div>
  );
};

export default LoginPage;
