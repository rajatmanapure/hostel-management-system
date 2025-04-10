import React, { useEffect, useState } from "react";
import styles from "./studentprofile.module.css";

const studentprofile = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/admin/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  return (
    <div className={styles.studentProfileContainer}>
      <h2 className={styles.headingPrimary}>Student Profile</h2>
      <p>View and manage student profiles, including academic details.</p>
      <div className={styles.tableContainer}>
        {students.length > 0 ? (
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Student Id</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.id}</td>
                  <td>{student.full_name}</td>
                  <td>{student.username}</td>
                  <td>{student.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noStudents}>No student records found.</p>
        )}
      </div>
    </div>
  );
};

export default studentprofile;
