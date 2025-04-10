import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "./adminlogin.module.css"; // Import module CSS

const adminlogin = () => {
  const [admin, setAdmin] = useState({ admin_username: "", admin_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        admin_username: admin.admin_username,
        admin_password: admin.admin_password 
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          title: "Login Successful!",
          text: "Welcome to the Admin Dashboard",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      } else {
        Swal.fire({
          title: "Invalid Credentials",
          text: "Please check your username and password.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error("Login Error:", error);
      Swal.fire({
        title: "Login Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    });
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputField}>
            <label>Username</label>
            <input
              type="text"
              required
              value={admin.admin_username}
              onChange={(e) => setAdmin({ ...admin, admin_username: e.target.value })}
            />
          </div>

          <div className={`${styles.inputField} ${styles.passwordField}`}>
            <label>Password</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={admin.admin_password}
                onChange={(e) => setAdmin({ ...admin, admin_password: e.target.value })}
              />
              <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <br />

          <button type="submit" className={styles.loginBtn}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default adminlogin;
