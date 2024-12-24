'use client';
import React, { useState } from "react";
import Link from "next/link";
import "../../css/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === "test@example.com" && password === "password123") {
      localStorage.setItem("accessToken", "dummyAccessToken");
      localStorage.setItem("refreshToken", "dummyRefreshToken");
      window.location.href = "/";  
    } else {
      setError("Login failed. Please check your credentials and try again.");
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
