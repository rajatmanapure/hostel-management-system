import React, { useState, useEffect } from "react";
import axios from "axios";
import "./complaintbox.css";

const complaintbox = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/fetchcomplaints");
      setComplaints(response.data || []);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError(err.response?.data?.error || "Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          (complaint.id || complaint._id) === id
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
  
      await axios.put(`http://localhost:3000/updatecomplaint/${id}`, 
        { status: newStatus }, 
        { headers: { "Content-Type": "application/json" } }
      );
  
      fetchComplaints();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(`Failed to update status: ${err.response?.data?.error || err.message}`);
      fetchComplaints();
    }
  };
  
  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
  
    try {
      await axios.delete(`http://localhost:3000/deletecomplaints/${id}`);
      setComplaints(prev => prev.filter(complaint => (complaint.id || complaint._id) !== id));
      alert("Complaint deleted successfully!");
    } catch (err) {
      console.error("Failed to delete complaint:", err);
      alert(`Failed to delete complaint: ${err.response?.data?.error || err.message}`);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filterStatus === "All") return true;
    return (complaint.status || "Pending").toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return "status-completed";
      case "In Progress": return "status-in-progress";
      default: return "status-pending";
    }
  };

  return (
    <div className="complaint-box-container">
      <h2>Complaint Management</h2>
      
      <div className="filter-controls">
        <label>
          Filter by Status:
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <button onClick={fetchComplaints} disabled={loading}>
          Refresh
        </button>
        <button onClick={() => setComplaints([])} className="btn-delete-all">
          Delete All
        </button>
      </div>

      {loading && <div className="loading">Loading complaints...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="complaints-table-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Room No.</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Complaint</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => {
                const complaintId = complaint.id || complaint._id;
                return (
                  <tr key={complaintId}>
                    <td>{complaintId.toString().substring(0, 6)}...</td>
                    <td>{complaint.fullName}</td>
                    <td>{complaint.roomNo}</td>
                    <td>{complaint.mobileNo}</td>
                    <td>{complaint.email}</td>
                    <td className="complaint-text">{complaint.complaint}</td>
                    <td className={getStatusClass(complaint.status)}>
                      {complaint.status || "Pending"}
                    </td>
                    <td>
                      {complaint.image ? (
                        <img 
                          src={`http://localhost:3000/uploads/${complaint.image}`} 
                          alt="Complaint" 
                          className="complaint-image"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => updateComplaintStatus(complaintId, "In Progress")}
                        disabled={complaint.status === "In Progress"}
                        className="btn-in-progress"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateComplaintStatus(complaintId, "Completed")}
                        disabled={complaint.status === "Completed"}
                        className="btn-complete"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => deleteComplaint(complaintId)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="no-complaints">
                  {loading ? "Loading..." : "No complaints found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default complaintbox;
