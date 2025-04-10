import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./dashboard.module.css";

const dashboard = () => {
  const [registrationCount, setRegistrationCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [firstYearCount, setFirstYearCount] = useState(0);
  const [secondYearCount, setSecondYearCount] = useState(0);
  const [thirdYearCount, setThirdYearCount] = useState(0);

  useEffect(() => {
    // Fetch registration count from tb_reg
    axios.get("http://localhost:3000/Admin/countRegistrations")
      .then(res => setRegistrationCount(res.data.count))
      .catch(err => console.error("Error fetching registration count:", err));

    // Fetch accepted students count from tb_user
    axios.get("http://localhost:3000/Admin/countAccepted")
      .then(res => setAcceptedCount(res.data.count))
      .catch(err => console.error("Error fetching accepted students count:", err));

    // Fetch total hostel bookings count from tb_hostel_booking
    axios.get("http://localhost:3000/Admin/countBookings")
      .then(res => setBookingCount(res.data.count))
      .catch(err => console.error("Error fetching booking count:", err));

    // Fetch year-wise student count from tb_hostel_booking
    axios.get("http://localhost:3000/Admin/countFirstYear")
      .then(res => setFirstYearCount(res.data.count))
      .catch(err => console.error("Error fetching first year count:", err));

    axios.get("http://localhost:3000/Admin/countSecondYear")
      .then(res => setSecondYearCount(res.data.count))
      .catch(err => console.error("Error fetching second year count:", err));

    axios.get("http://localhost:3000/Admin/countThirdYear")
      .then(res => setThirdYearCount(res.data.count))
      .catch(err => console.error("Error fetching third year count:", err));
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.heading}>Admin Dashboard</h2>
      <div className={styles.gridContainer}>
        <div className={styles.card}>
          <h3>Registered Students</h3>
          <p>{registrationCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Approval Students</h3>
          <p>{acceptedCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Bookings</h3>
          <p>{bookingCount}</p>
        </div>
        <div className={styles.card}>
          <h3>First Year Students</h3>
          <p>{firstYearCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Second Year Students</h3>
          <p>{secondYearCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Third Year Students</h3>
          <p>{thirdYearCount}</p>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
