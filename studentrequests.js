import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import styles from "./studentrequests.module.css";

const studentrequests = () => {
  const [requests, setRequests] = useState([]);

  // Fetch student requests from the database
  useEffect(() => {
    fetch("http://localhost:3000/admin/student-requests")
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  // Accept request
  const handleAccept = (full_name) => {
    Swal.fire({
      title: "Accept Request?",
      text: `Are you sure you want to accept ${full_name}'s request?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3000/admin/acceptUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name })
        })
          .then(response => response.json())
          .then(data => {
            Swal.fire("Accepted!", data.message, "success");
            setRequests(requests.filter(request => request.full_name !== full_name));
          })
          .catch(error => {
            console.error("Error accepting request:", error);
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  // Reject request and notify the user
  const handleDelete = (full_name, username) => {
    Swal.fire({
      title: "Reject Request?",
      text: `Are you sure you want to reject ${full_name}'s request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3000/admin/rejectUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name, username })
        })
          .then(response => response.json())
          .then(data => {
            Swal.fire("Rejected!", data.message, "success");
            setRequests(requests.filter(request => request.full_name !== full_name));
          })
          .catch(error => {
            console.error("Error rejecting request:", error);
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  return (
    <div className={styles.studentRequestsContainer}>
      <h1 className={styles.headingPrimary}>Student Requests</h1>

      <div className={styles.requestsTableContainer}>
        {requests.length > 0 ? (
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.full_name}</td>
                  <td>{request.username}</td>
                  <td>{request.password}</td>
                  <td className={styles.actionButtons}>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => handleAccept(request.full_name)}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(request.full_name, request.username)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noRequests}>No student requests found.</p>
        )}
      </div>
    </div>
  );
};

export default studentrequests;
