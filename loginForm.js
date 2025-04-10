import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert";
import "./auth.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>NAGZIRA BOYS HOSTEL </h1>
        <button className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
        <ul className={`nav-links ${menuOpen ? "mobile-menu-open" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/dining" onClick={() => setMenuOpen(false)}>Dining</Link></li>
          <li><Link to="/complaint" onClick={() => setMenuOpen(false)}>Complaint</Link></li>
          <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
          <li><Link to="/admin/login" onClick={() => setMenuOpen(false)}>Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
};

const Login_Form = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("full_name", data.full_name);

        swal({
          title: "Success!",
          text: "Login Successful!",
          icon: "success",
          button: "Proceed",
        }).then(() => {
          navigate("/hostelbook");
        });
      } else {
        swal({
          title: "Error!",
          text: data.message || "Invalid username or password.",
          icon: "error",
          button: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      swal({
        title: "Server Error",
        text: "An error occurred. Please try again later.",
        icon: "error",
        button: "OK",
      });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: resetUsername, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        swal({
          title: "Success!",
          text: "Password reset successfully! Please log in.",
          icon: "success",
          button: "OK",
        }).then(() => {
          setIsForgotPassword(false);
        });
      } else {
        swal({
          title: "Error!",
          text: data.message || "Failed to reset password.",
          icon: "error",
          button: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      swal({
        title: "Server Error",
        text: "An error occurred. Please try again later.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <h3>{isForgotPassword ? "Reset Password" : "Login"}</h3>
        </div>

        {!isForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <div className="login-card-body">
              <div className="login-form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="login-form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="off"
                  />
                  <span onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="login-card-body">
              <div className="login-form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="login-form-group">
                <label>New Password</label>
                <div className="password-wrapper">
                  <input
                    type={resetPasswordVisible ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    autoComplete="off"
                  />
                  <span onClick={() => setResetPasswordVisible(!resetPasswordVisible)}>
                    {resetPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="login-form-group">
                <label>Confirm Password</label>
                <div className="password-wrapper">
  <input
    type={confirmPasswordVisible ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Confirm new password"
    required
    autoComplete="off"
  />
  {/* Password Match Icon */}
  {confirmPassword && (
    <span
      className={`password-match-icon ${
        newPassword === confirmPassword ? "" : "wrong"
      }`}
    >
      {newPassword === confirmPassword ? "✅" : "❌"}
    </span>
  )}
  {/* Eye Icon */}
  <span onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

              </div>
              <button type="submit" className="login-btn">
                Change Password
              </button>
            </div>
          </form>
        )}

        {message && <p className="text-danger">{message}</p>}

        <div className="login-links">
          {!isForgotPassword ? (
            <>
              <p>
                <Link to="#" onClick={() => setIsForgotPassword(true)}>
                  Forgot Password?
                </Link>
              </p>
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
              <p>
                <Link to="/">Go to Home</Link>
              </p>
            </>
          ) : (
            <p>
              <Link to="#" onClick={() => setIsForgotPassword(false)}>
                Back to Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
// Footer Component
const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ABOUT</h3>
          <p>Nazgira Boys Hostel</p>
          <p>Established in 1990</p>
        </div>
        <div className="footer-section">
          <h3>QUICK LINKS</h3>
          <ul>
          <li><Link to="/complaint" onClick={() => setMenuOpen(false)}>Complaint</Link></li>
          <li><Link to="/dining" onClick={() => setMenuOpen(false)}>Dining</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>HOW TO REACH</h3>
          <p>Nazira Boys Hostel near Government Polytechnic Sakoli,</p>
          <p>441802, Bhandara, Maharashtra</p>
          <p>Email: example@email.com</p>
          <p>Phone: +91 XXXXX XXXXX</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2024-25 Nazira Boys Hostel | Site Design & Developed By:Samyak Dhargave| Sarthak Hursad| Rajat Manapure</p>
      </div>
    </footer>
  );
};

const loginform = () => {
  return (
    <>
      <Navbar />
      <Login_Form/>
      <Footer />
    </>
  );
};


export default loginform;
