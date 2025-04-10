import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./hostelbook.css";



function HostelBooking() {
  const [formData, setFormData] = useState({

    dateOfBirth: "",
    year:"",
    semester: "",
    educationType: "",
    branch: "",
    percentage:"",
    mobileNumber: "",
    parentMobileNumber: "",
    address: "",
    profileImage: null,
    marksheet: null,
    casteCertificate: null,
    admissionReceipt: null,
  });

  const [bookingStatus, setBookingStatus] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: "", user_id: "",full_name:"" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("user_id");
    const storedFullName = localStorage.getItem("full_name");
  
    if (storedUsername && storedUserId && storedFullName) {
      setUser({ username: storedUsername, user_id: storedUserId, full_name: storedFullName });
  
      // Fetch booking status
      fetch(`http://localhost:3000/getStatus?user_id=${storedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBookingStatus(data.status);
          }
        })
        .catch((err) => console.error("Error fetching booking status:", err));
    } else {
      Swal.fire({
        title: "Error!",
        text: "User not found. Redirecting to login...",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => navigate("/login"));
    }
  }, [navigate]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire("Error!", "Only PNG, JPG, JPEG, or PDF files are allowed.", "error");
        return;
      }
      setFormData({ ...formData, [fieldName]: file });
    }
  };

  const handleAdmissionResponse = async (response) => {
    try {
        const res = await fetch("http://localhost:3000/setResponse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ response, user_id: user.user_id }),
        });

        const data = await res.json();
        if (res.ok) {
            Swal.fire("Success!", data.message, "success");
        } else {
            Swal.fire("Error!", data.message, "error");
        }
    } catch (error) {
        console.error("Error setting response status:", error);
        Swal.fire("Error!", "Failed to set response status.", "error");
    }
};


  const validateMobileNumber = (number) => {
    return /^[0-9]{10}$/.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateMobileNumber(formData.mobileNumber) || !validateMobileNumber(formData.parentMobileNumber)) {
      Swal.fire("Error!", "Please enter a valid 10-digit mobile number.", "error");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
formDataToSend.append("fullName", user.full_name);  // Append first ✅
formDataToSend.append("username", user.username);
formDataToSend.append("user_id", user.user_id);
Object.keys(formData).forEach((key) => {
  if (formData[key]) {
    formDataToSend.append(key, formData[key]);
  }
});


    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/book", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Booking successfully saved!",
          icon: "success",
          confirmButtonText: "OK",
        })
      } else {
        Swal.fire("Error!", data.message || "Failed to save booking.", "error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      Swal.fire("Error!", "An error occurred while saving the booking.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    Swal.fire({
      title: "Logged Out!",
      text: "You have been logged out successfully.",
      icon: "info",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/login");
      window.history.pushState(null, "", "/login");
      window.location.href = "/login";
    });
  };




return (
  <div className="App">
      <div className="form-container">
          <h1>Hostel Booking Form</h1>
          <div className="user-info">
              <h2>Welcome, {user.username} <br />
              User ID: {user.user_id} <br />
              Full Name: {user.full_name}</h2>

              <button className="logout-button" onClick={handleLogout}>
                  Logout
              </button>
          </div>

          {bookingStatus === "Accept" ? (
  <div className="admission-confirmation">
    <h2>Do you want admission in the hostel?</h2>
    <button onClick={() => handleAdmissionResponse("Yes")} className="yes-button">
      Yes
    </button>
    <button onClick={() => handleAdmissionResponse("No")} className="no-button">
      No
    </button>
  </div>
) : formSubmitted ? (
  <div className="confirmation">
    <h2>Booking Confirmed!</h2>
    {Object.keys(formData).map(
      (key) =>
        !["profileImage", "marksheet", "casteCertificate", "admissionReceipt"].includes(key) && (
          <p key={key}>
            {key.replace(/([A-Z])/g, " $1")}: {formData[key]}
          </p>
        )
    )}
  </div>
) : (
  <form onSubmit={handleSubmit}>
              
                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                <label>Year:</label>
                <select name="year" value={formData.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                </select>
              </div>
              
                <div className="form-group">
                  <label>Semester:</label>
                  <select name="semester" value={formData.semester} onChange={handleChange} required>
                    <option value="">Select Semester</option>
                    {formData.year === "1" && ["First", "Second"].map((sem) => <option key={sem} value={sem}>{sem} Semester</option>)}
                    {formData.year === "2" && ["Third", "Fourth"].map((sem) => <option key={sem} value={sem}>{sem} Semester</option>)}
                    {formData.year === "3" && ["Fifth", "Sixth"].map((sem) => <option key={sem} value={sem}>{sem} Semester</option>)}
                  </select>
                </div>
              
                {formData.semester === "First" && (
                  <div className="form-group">
                    <label>Previous Education Type:</label>
                    <select name="educationType" value={formData.educationType} onChange={handleChange} required>
                      <option value="">Select Education Type</option>
                      <option value="HSC">HSC</option>
                      <option value="SSC">SSC</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label>Branch:</label>
                  <select name="branch" value={formData.branch} onChange={handleChange} required>
                    <option value="">Select Branch</option>
                    <option value="CM">Computer Technology</option>
                    <option value="EE">Electrical Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="CE">Civil Engineering</option>
                    <option value="ETE">Electronics & Tele. Engineering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Previous Year Percentage % :</label>
                  <input type="text" name="percentage" value={formData.percentage} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Mobile Number:</label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Parent Mobile Number:</label>
                  <input type="tel" name="parentMobileNumber" value={formData.parentMobileNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                  <label>Profile Image:</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profileImage")} required />
                </div>
                <div className="form-group">
                  <label>Semester Marksheet:</label>
                  <input type="file" accept="image/*, application/pdf" onChange={(e) => handleFileChange(e, "marksheet")} required />
                </div>
                <div className="form-group">
                  <label>Caste Certificate:</label>
                  <input type="file" accept="image/*, application/pdf" onChange={(e) => handleFileChange(e, "casteCertificate")} required />
                </div>
                <div className="form-group">
                  <label>Admission Receipt:</label>
                  <input type="file" accept="image/*, application/pdf" onChange={(e) => handleFileChange(e, "admissionReceipt")} required />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Book Now"}
                </button>
              </form>
            )}
          
      </div>
  </div>
)};


export default HostelBooking;
