import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./finallist.module.css";

const finallist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:3000/admin/final-list")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data.");
        setLoading(false);
      });
  };

  const handleAccept = (id) => {
    setProcessingId(id);
    fetch(`http://localhost:3000/admin/accept-booking/${id}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        setProcessingId(null);
        Swal.fire("Success", "Room booked and email sent successfully!", "success");
      })
      .catch((err) => {
        console.error("Error accepting request:", err);
        setProcessingId(null);
        Swal.fire("Error", "Failed to accept the request.", "error");
      });
  };

  const handleReject = (id) => {
    setProcessingId(id);
    fetch(`http://localhost:3000/admin/reject-booking/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        setProcessingId(null);
        Swal.fire("Rejected", "Request rejected and email sent.", "success");
      })
      .catch((err) => {
        console.error("Error rejecting request:", err);
        setProcessingId(null);
        Swal.fire("Error", "Failed to reject the request.", "error");
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Final List of Hostel Booking Requests</h2>
      {loading ? (
        <p className={styles.loadingText}>Loading...</p>
      ) : error ? (
        <p className={styles.errorText}>{error}</p>
      ) : data.length === 0 ? (
        <p className={styles.noDataText}>No data available.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.requestTable}>
          <thead>
  <tr>
    <th>S. No</th>
    <th>Full Name</th>
    <th>Date of Birth</th>
    <th>Year</th>
    <th>Semester</th>
    <th>Previous Education</th>
    <th>Branch</th>
    <th>Percentage</th>
    <th>Mobile</th>
    <th>Response</th>
    <th>Actions</th>
  </tr>
</thead>

<tbody>
  {data.map((item, index) => (
    <tr key={item.id}>
      <td>{index + 1}</td><td>{item.full_name}</td><td>{item.date_of_birth}</td>
      <td>{item.year}</td><td>{item.semester}</td><td>{item.education_type}</td>
      <td>{item.branch}</td><td>{item.percentage}%</td><td>{item.mobile_number}</td>
      <td>{item.response}</td>
      <td>
        <button
          className={styles.acceptBtn}
          onClick={() => handleAccept(item.id)}
          disabled={processingId === item.id}
        >
          {processingId === item.id ? "Processing..." : "Accept"}
        </button>
        <button
          className={styles.rejectBtn}
          onClick={() => handleReject(item.id)}
          disabled={processingId === item.id}
        >
          {processingId === item.id ? "Processing..." : "Reject"}
        </button>
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </div>
      )}
    </div>
  );
};

export default finallist;
