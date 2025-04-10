import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; 
import styles from "./admindashboard.module.css";

const admindashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent Back Navigation After Logout
  useEffect(() => {
    const handleBackButton = () => {
      if (!localStorage.getItem("adminAuthenticated")) {
        navigate("/admin/login", { replace: true });
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated"); // Clear login session
    navigate("/admin/login", { replace: true }); // Redirect to login page
    setTimeout(() => {
      window.history.pushState(null, null, window.location.href); // Prevent back navigation
    }, 0);
  };
  

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <h2 className={styles.logo}>Boys Hostel</h2>
        <ul>
          <li>
            <Link 
              to="/admin/dashboard" 
              className={activePage === "Dashboard" ? styles.active : ""} 
              onClick={() => setActivePage("Dashboard")}
            >
              🏠 Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/profile" 
              className={activePage === "Profile" ? styles.active : ""} 
              onClick={() => setActivePage("Profile")}
            >
              👤 Admin Profile
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/deletedata" 
              className={activePage === "DeleteData" ? styles.active : ""} 
              onClick={() => setActivePage("DeleteData")}
            >
              📊 DeleteData
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/student-requests" 
              className={activePage === "Student Requests" ? styles.active : ""} 
              onClick={() => setActivePage("Student Requests")}
            >
              👥 Student Requests
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/student-profile" 
              className={activePage === "Student Profile" ? styles.active : ""} 
              onClick={() => setActivePage("Student Profile")}
            >
              📖 Student Profile
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/merit-list" 
              className={activePage === "Merit List" ? styles.active : ""} 
              onClick={() => setActivePage("Merit List")}
            >
              🏅 Merit List
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/download-documents" 
              className={activePage === "Download Documents" ? styles.active : ""} 
              onClick={() => setActivePage("Download Documents")}
            >
              📂 Download Documents
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/hostel-booking-requests" 
              className={activePage === "Hostel Booking Requests" ? styles.active : ""} 
              onClick={() => setActivePage("Hostel Booking Requests")}
            >
              📝 Hostel Booking Requests
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/final-list" 
              className={activePage === "Final List" ? styles.active : ""} 
              onClick={() => setActivePage("Final List")}
            >
              📃 Final List
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/download-final-list" 
              className={activePage === "Download Final List" ? styles.active : ""} 
              onClick={() => setActivePage("Download Final List")}
            >
              📥 Download Final List
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/complaint-box" 
              className={activePage === "Complaint Box" ? styles.active : ""} 
              onClick={() => setActivePage("Complaint Box")}
            >
              🗃️ Complaint Box
            </Link>
          </li>
        
        <li>
            <Link 
              to="/admin/Adminp" 
              className={activePage === "Adminp" ? styles.active : ""} 
              onClick={() => setActivePage("Adminp")}
            >
              🗃️ Mess Management
            </Link>
          </li>
        </ul>
        
        
       

        {/* Logout button */}
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </nav>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <div 
          className={`${styles.content} ${
            location.pathname === "/admin/dashboard" ? styles.centerContent : styles.topContent
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default admindashboard;
