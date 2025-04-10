import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import f1 from "./images/front.jpg";
import hostelImage from "./images/hostel.jpg";
import room1 from "./images/room1.jpg";
import room2 from "./images/room2.jpg";
import room3 from "./images/room3.jpg";
import dining1 from "./images/dining1.jpg";
import dining2 from "./images/dining2.jpg";
import dining3 from "./images/dining3.jpg";
import dining4 from "./images/dining4.jpg";
import event1 from "./images/event1.jpg";
import event2 from "./images/event2.jpg";
import event3 from "./images/event3.jpg";
import security1 from "./images/security1.jpg";
import security2 from "./images/security2.jpg";
import "./home.css";

// ✅ Navbar Component
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

// ✅ Home Page
const Home = () => {
  return (
    <div className="home">
      <img src={f1} alt="Hostel" />
      <div className="home-text">
        <h1>WELCOME TO NAGZIRA BOYS HOSTEL</h1>
        <p>Nagzira Boys Hostel is a serene and peaceful retreat, nestled away from the bustling city and surrounded by nature.</p>
        <div className="homeimg">
          <img src={hostelImage} alt="Hostel" />
        </div>
      </div>
    </div>
  );
};

// Notice Section
const Notice = () => (
  <section className="notice">
    <h2>Notices</h2>
    <p>⚠️ White worm found in food</p>
    <p>⚠️ 2 students fell sick due to low-quality mess food</p>
  </section>
);

// Gallery Section
const Gallery = () => {
  const images = [room1, room2, room3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  return (
    <section id="room" className="gallery">
      <h2>Available Rooms</h2>
      <div className="gallery-container">
        <div className="image-wrapper blurred">
          <img src={images[(currentIndex - 1 + images.length) % images.length]} alt="Previous Room" loading="lazy" />
        </div>
        <div className="image-wrapper">
          <img src={images[currentIndex]} alt="Current Room" loading="lazy" />
        </div>
        <div className="image-wrapper blurred">
          <img src={images[(currentIndex + 1) % images.length]} alt="Next Room" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

// Dining Area Section
const DiningArea = () => {
  const images = [dining1, dining2, dining3, dining4];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dining-container">
      <h2 className="dining-title">DINING AREA</h2>
      <p className="dining-description">
        This cozy dining area offers a spacious hall with large tables and bench seating,
        designed to accommodate residents comfortably during meal times.
      </p>
      <div className="dining-slider">
        <img src={images[index]} alt="Main Dining" className="large-image" loading="lazy" />
        <img src={images[(index + 1) % images.length]} alt="Small Dining" className="small-image" loading="lazy" />
      </div>
    </div>
  );
};

// Events Slider Section
const EventsSlider = () => {
  const images = [event1, event2, event3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="events-container">
      <h2 className="events-title">
        <span className="line"></span> EVENTS <span className="line"></span>
      </h2>
      <div className="slider">
        <img src={images[(currentIndex - 1 + images.length) % images.length]} alt="Previous" className="small-image" loading="lazy" />
        <img src={images[currentIndex]} alt="Main Event" className="main-image" loading="lazy" />
        <img src={images[(currentIndex + 1) % images.length]} alt="Next" className="small-image" loading="lazy" />
      </div>
    </div>
  );
};

// Security Section
const Security = () => {
  return (
    <div className="security-container">
      <h2 className="security-title">
        <span className="line"></span> 24/7 SECURITY <span className="line"></span>
      </h2>
      <div className="security-images">
        <div className="security-box">
          <img src={security1} alt="Security Camera" className="security-image" />
        </div>
        <div className="security-box">
          <img src={security2} alt="Security Guard" className="security-image" />
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

// Main Page Component
const MainPage = () => {
  return (
    <>
      <Navbar />
      <Home />
      <Notice />
      <Gallery />
      <DiningArea />
      <EventsSlider />
      <Security />
      <Footer />
    </>
  );
};

export default MainPage;
