"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import "../../css/LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post("http://localhost:2000/api/v1/login/", {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Redirect to home page
      window.location.href = "/";
    } catch (err: any) {
      // Handle errors gracefully
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-heading">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <input
                type="text"
                placeholder="Username" // Updated placeholder
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Updated state setter
                className="login-input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
              <button type="submit" className="login-button">
                Login
              </button>
            </div>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p className="account-link">
            Don't have an account?{" "}
            <Link href="/register" className="register-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
