import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./dining.css";
import Slider from "./Slider"; 
import diningImage from "../images/img1.jpg"; 

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


const Dining_Middle = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    
    <div className="dining-container">
      <br />
      <Slider />
      <br /><br />

      <div className="dining-content">
        <img src={diningImage} alt="Dining" className="dining-image" />

        <div className="dining-text">
          <p>
            Experience a clean and welcoming dining environment where every
            meal is crafted to meet high standards of taste and health.
          </p>
          <br /><br />
          <div className="para1">
            Easily track your mess expenses and settle payments with a click.
          </div>
        </div>
      </div>
      <br />

      {/* Payment Section */}
      <div className="payment">
        <h3 className="button-title">Track & Pay Mess Expenses</h3>
        <div className="buttons">
          
          {/* Navigate to Payment Page when clicking */}
          <button className="btn" onClick={() => navigate("/payment")}>
            Payments
          </button>
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
        </div>        <div className="footer-section">
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

const dining = () => {
  return (
    <>
      <Navbar />
      <Dining_Middle/>
      <Footer />
    </>
  );
};

export default dining;
