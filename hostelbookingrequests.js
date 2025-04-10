import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./hostelbookingrequests.module.css";

const hostelbookingrequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Hostel Booking Requests
  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:3000/admin/hostel-booking-requests")
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => a.year - b.year);
        setRequests(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data.");
        console.error("Error fetching hostel booking requests:", err);
        setLoading(false);
      });
  };

  // Convert year to text
  const getYearText = (year) => {
    const yearMap = {
      1: "First Year",
      2: "Second Year",
      3: "Third Year",
    };
    return yearMap[year] || "Unknown Year";
  };

  // SweetAlert for Success & Error
  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "OK",
      background: "#333",
      color: "#fff"
    });
  };

  // Accept Request
  const handleAccept = (id) => {
    setProcessingId(id);
    fetch(`http://localhost:3000/admin/accept-request/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        setProcessingId(null);
        showAlert("Accepted!", "The request has been accepted.", "success");
      })
      .catch((err) => {
        console.error("Error accepting request:", err);
        setProcessingId(null);
        showAlert("Error!", "Failed to accept the request.", "error");
      });
  };

  // Reject Request
  const handleReject = (id) => {
    setProcessingId(id);
    fetch(`http://localhost:3000/admin/reject-request/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        setProcessingId(null);
        showAlert("Rejected!", "The request has been rejected.", "success");
      })
      .catch((err) => {
        console.error("Error rejecting request:", err);
        setProcessingId(null);
        showAlert("Error!", "Failed to reject the request.", "error");
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Hostel Booking Requests</h2>
      {loading ? (
        <p className={styles.loadingText}>Loading requests...</p>
      ) : error ? (
        <p className={styles.errorText}>{error}</p>
      ) : requests.length > 0 ? (
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Full Name</th>
              <th>Mobile</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Percentage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request.id} className={styles.dataRow}>
                <td>{index + 1}</td>
                <td>{request.full_name}</td>
                <td>{request.mobile_number}</td>
                <td>{getYearText(request.year)}</td>
                <td>{request.semester}</td>
                <td>{request.percentage}%</td>
                <td>
                  <button
                    className={styles.acceptBtn}
                    onClick={() => handleAccept(request.id)}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? "Processing..." : "Accept"}
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? "Processing..." : "Reject"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noDataText}>No requests available.</p>
      )}
    </div>
  );
};

export default hostelbookingrequests;
