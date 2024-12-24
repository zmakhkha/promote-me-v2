'use client';
import React, { useState } from "react";
import Link from "next/link";
import "../../css/RegisterPage.css"; // Importing register.css

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your registration logic here
    console.log(formData); // Log form data for now
    alert("Registered successfully!");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-heading">Sign Up for Love!</h1>
          <form onSubmit={handleRegister}>
            <div className="form-row">
              <div className="input-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="register-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="register-input"
                  required
                />
              </div>
            </div>
        
            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            <div className="form-row">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="register-input"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-row">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            <button type="submit" className="register-button">
              Register
            </button>
          </form>
          <p className="account-link">
            Already have an account?{" "}
            <Link href="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
