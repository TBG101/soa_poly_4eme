import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../api/graphqlQueries";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createUser, { loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ variables: { username, password } });
      alert("Signup successful!");
      window.dispatchEvent(new Event("auth-changed"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
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
          Signup
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default SignupPage;
