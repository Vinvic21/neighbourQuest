import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker",
    location: "",
    skill_category: "plumbing",
    business_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      setError("Unable to register user. Please try again.");
    }
  }

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">+</span>
          <h2>NeighborQuest</h2>
        </div>

        <h3 className="auth-title">Create Your Account</h3>
        <p className="auth-subtitle">Join as a worker or employer</p>

        <div className="auth-toggle">
          <Link to="/login">Sign In</Link>
          <Link to="/register" className="active">Sign Up</Link>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="auth-password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={toggleShowPassword}>
              {showPassword ? "hide" : "show"}
            </span>
          </div>

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="worker">Worker</option>
            <option value="employer">Employer</option>
            <option value="both">Both</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Your location (e.g. Nairobi)"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {(formData.role === "worker" || formData.role === "both") && (
            <select
              name="skill_category"
              value={formData.skill_category}
              onChange={handleChange}
            >
              <option value="plumbing">Plumbing</option>
              <option value="cleaning">Cleaning</option>
              <option value="electrical">Electrical</option>
              <option value="delivery">Delivery</option>
              <option value="other">Other</option>
            </select>
          )}

          {(formData.role === "employer" || formData.role === "both") && (
            <input
              type="text"
              name="business_name"
              placeholder="Business name (optional)"
              value={formData.business_name}
              onChange={handleChange}
            />
          )}

          <button type="submit" className="auth-submit-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;