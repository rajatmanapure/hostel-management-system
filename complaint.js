import React, { useState, useEffect } from "react";
import axios from "axios";
import "./complaint.css";
import { Link } from "react-router-dom";

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

const complaintSuggestions = [
  { type: "Water leakage", contact: "Plumber: +91 9876543210" },
  { type: "Electricity issue", contact: "Electrician: +91 9123456789" },
  { type: "Room cleaning required", contact: "Housekeeping: +91 9234567890" },
  { type: "Food quality issue", contact: "Mess Incharge: +91 9345678901" },
  { type: "Furniture broken", contact: "Carpenter: +91 9456789012" },
  { type: "Washroom maintenance", contact: "Maintenance: +91 9567890123" },
];

const Complaint_Form = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    roomNo: "",
    mobileNo: "",
    email: "",
    complaint: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedContact, setSelectedContact] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "complaint") {
      const suggestions = complaintSuggestions.filter((suggestion) =>
        suggestion.type.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(suggestions);

      const selectedComplaint = complaintSuggestions.find(
        (item) => item.type.toLowerCase() === value.toLowerCase()
      );
      setSelectedContact(selectedComplaint ? selectedComplaint.contact : "");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, complaint: suggestion.type });
    setFilteredSuggestions([]);
    setSelectedContact(suggestion.contact);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await axios.post("http://localhost:3000/complaints", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
      setFormData({ fullName: "", roomNo: "", mobileNo: "", email: "", complaint: "", image: null });
      setPreviewImage(null);
      setSelectedContact("");
    } catch (error) {
      setMessage("❌ Error submitting complaint");
      console.error(error);
    }
  };

  return (
    <div className="complaint-container">
      <h2 className="form-title">Complaint Form</h2>
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="complaint-form">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="text"
          name="roomNo"
          value={formData.roomNo}
          onChange={handleChange}
          placeholder="Room No."
          required
        />
        <input
          type="tel"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          placeholder="Mobile No."
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email ID"
          required
        />

        <div className="autocomplete-container">
          <textarea
            name="complaint"
            value={formData.complaint}
            onChange={handleChange}
            placeholder="Complaint"
            required
          ></textarea>
          {filteredSuggestions.length > 0 && (
            <ul className="suggestion-list">
              {filteredSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.type}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedContact && (
          <p className="contact-info">
            <strong>Contact:</strong> {selectedContact}
          </p>
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && <img src={previewImage} alt="Preview" />}

        <button type="submit">Submit</button>
      </form>
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

const ComplaintForm = () => {
  return (
    <>
      <Navbar />
      <Complaint_Form/>
      <Footer />
    </>
  );
};


export default ComplaintForm;
