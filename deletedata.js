import React, { useState } from "react";
import styles from "./deletedata.module.css";
import Swal from "sweetalert2";

const deletedata = () => {
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "All data will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const response = await fetch("http://localhost:3000/delete-all-data");

      const data = await response.json();
      setMessage(data.message);

      Swal.fire("Deleted!", data.message, "success");
    } catch (error) {
      setMessage("Error deleting data");
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Delete All Data</h2>
      <p>Click the button below to remove all data from the database and reset IDs.</p>
      <button className={styles.deleteButton} onClick={handleDelete}>
        Delete All Data
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default deletedata;
