import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./component/loginForm.js";
import SignUp from "./component/signUp.js";
import Hostelbook from "./component/hostelbook.js";
import Home from "./component/home.js";
import ProtectedRoute from "./component/protectedroute.js";
import ComplaintForm from "./component/complaint.js";
import Dining from "./component/dining.js";
import Payment from "./component/payment.js";
// ✅ Import Admin Components
import AdminDashboard from "./component/Admin/admindashboard.js";
import AdminProfile from "./component/Admin/adminprofile.js";
import DeleteData from "./component/Admin/deletedata.js";
import StudentRequests from "./component/Admin/studentrequests.js";
import StudentProfile from "./component/Admin/studentprofile.js";
import MeritList from "./component/Admin/meritlist.js";
import DownloadDocuments from "./component/Admin/downloaddocuments.js";
import AdminLogin from "./component/Admin/adminlogin.js";
import Dashboard from "./component/Admin/dashboard1.js";
import HostelBookingRequests from "./component/Admin/hostelbookingrequests.js"
import FinalList from "./component/Admin/finallist.js";
import DownloadFinalList from "./component/Admin/downloadfinalList.js";
import ComplaintBox from "./component/Admin/complaintbox.js";
import Adminp from "./component/Admin/adminp.js"

// ✅ Import Bootstrap for styling
import "bootstrap/dist/css/bootstrap.min.css"; 

const App = () => {
  return (
    <Routes>
      {/* ✅ User Interface */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/complaint" element={<ComplaintForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dining" element={<Dining />} />
      <Route path="/payment" element={<Payment />} />

      {/* ✅ Protected Route for Hostel Booking */}
      <Route element={<ProtectedRoute />}>
        <Route path="/hostelbook" element={<Hostelbook />} />
      </Route>

      {/* ✅ Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/adminp" element={<Adminp />} />

      {/* Wrap all admin pages inside AdminDashboard */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="deletedata" element={<DeleteData />} />
        <Route path="student-requests" element={<StudentRequests />} />
        <Route path="student-profile" element={<StudentProfile />} />
        <Route path="merit-list" element={<MeritList />} />
        <Route path="download-documents" element={<DownloadDocuments />} />
        <Route path="hostel-booking-requests" element={<HostelBookingRequests />} />
        <Route path="final-list" element={<FinalList />} />
        <Route path="download-final-list" element={<DownloadFinalList />} />
        <Route path="complaint-box" element={<ComplaintBox />} />
        <Route path="adminp" element={<Adminp />} />   
      </Route>
    </Routes>
  );
};

export default App;
