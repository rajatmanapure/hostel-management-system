import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import "./signup.css";

const signUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Email Validation Function
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "username" || name === "password" || name === "confirmPassword" ? value.trim() : value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Track button state

const handleSignUp = async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // ✅ Prevent multiple requests

  setIsSubmitting(true); // ✅ Disable button

  if (!formData.fullName || !formData.username || !formData.password || !formData.confirmPassword) {
    Swal.fire("Error", "All fields are required", "error");
    setIsSubmitting(false);
    return;
  }

  if (!isValidEmail(formData.username)) {
    Swal.fire("Error", "Please enter a valid email address", "error");
    setIsSubmitting(false);
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    Swal.fire("Error", "Passwords do not match", "error");
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      Swal.fire("Error", data.message || "An error occurred. Please try again.", "error");
      setIsSubmitting(false);
      return;
    }

    Swal.fire({
      title: "Success!",
      text: data.message || "Successfully Registered! Please wait for admin approval.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      setIsSubmitting(false);
      navigate("/login");
    });

  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Failed to register. Please try again.", "error");
    setIsSubmitting(false);
  }
};


  return (
    <div className="signup-page">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignUp}>
          <h1>Create Your Account</h1>

          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <label htmlFor="username">Email</label>
          <input
            type="email"
            id="username"
            name="username"
            placeholder="Enter your email"
            value={formData.username}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <span className="match-icon">
              {formData.confirmPassword && formData.confirmPassword === formData.password ? (
                <FaCheckCircle className="match" />
              ) : (
                <FaTimesCircle className="mismatch" />
              )}
            </span>
          </div>

          <button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Processing..." : "Sign Up"}
</button>

          <p>
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default signUp;
