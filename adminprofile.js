import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import styles from "./adminprofile.module.css";

const adminprofile = () => {
  const [admin, setAdmin] = useState({
    admin_username: "",
    admin_password: "",
    admin_name: "",
    admin_email: "",
    admin_emailpass: "",
    admin_profile: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/profile")
      .then((response) => {
        setAdmin(response.data);
      })
      .catch((error) => console.error("Error fetching admin data:", error));
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("admin_username", admin.admin_username);
    formData.append("admin_password", admin.admin_password);
    formData.append("admin_name", admin.admin_name);
    formData.append("admin_email", admin.admin_email);
    formData.append("admin_emailpass", admin.admin_emailpass);

    if (selectedFile) {
      formData.append("admin_profile", selectedFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile Updated Successfully!");
      setEditMode(false);
      setAdmin(response.data);
    } catch (error) {
      console.error("Error updating admin profile:", error);
      alert("Update Failed!");
    }
  };

  return (
    <div className={styles.adminProfileContainer}>
      <h2 className={styles.headingPrimary}>Admin Profile</h2>

      <div className={styles.profileGrid}>
        <div className={styles.profileInfo}>
          <h5>Full Name: {admin.admin_name}</h5>
          <h5>Username: {admin.admin_username}</h5>
          <h5>Password: {admin.admin_password}</h5>
          <h5>Email: {admin.admin_email}</h5>
          <h5>Email Password: {admin.admin_emailpass}</h5>
        </div>
        <div className={styles.profileInfo}>
          
          <h5>Admin Profile Picture</h5>
          <img
            className={styles.profileImage}
            src={
              admin.admin_profile
                ? `http://localhost:3000/admin_uploads/${admin.admin_profile}`
                : "/default-profile.png"
            }
            alt="Admin Profile"
          />
        </div>
      </div>

     

      <button className={styles.changeBtn} onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Make Changes"}
      </button><br></br>



      {editMode && (
        <form onSubmit={handleSubmit} className={styles.profileCard}>
          <h2 className={styles.headingSecondary}>Edit Profile</h2>

          <label>Full Name:</label>
          <input type="text" name="admin_name" value={admin.admin_name} onChange={handleChange} />

          <label>Username:</label>
          <input type="text" name="admin_username" value={admin.admin_username} onChange={handleChange} />

          <label>Password:</label>
          <div className={styles.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="admin_password"
              value={admin.admin_password}
              onChange={handleChange}
              className={styles.passwordInput}
            />
            <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>Email:</label>
          <input type="email" name="admin_email" value={admin.admin_email} onChange={handleChange} />

          <label>Email Password:</label>
          <div className={styles.inputContainer}>
            <input
              type={showEmailPassword ? "text" : "password"}
              name="admin_emailpass"
              value={admin.admin_emailpass}
              onChange={handleChange}
              className={styles.passwordInput}
            />
            <span className={styles.eyeIcon} onClick={() => setShowEmailPassword(!showEmailPassword)}>
              {showEmailPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>Profile Picture:</label>
          <input type="file" name="admin_profile" onChange={handleFileChange} />

          <button className={styles.submitBtn} type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default adminprofile;
