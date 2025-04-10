import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from "./meritlist.module.css";

const meritlist = () => {
  const [selectedYear, setSelectedYear] = useState(1);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to format date (YYYY-MM-DD to DD-MM-YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  // Function to get current date in DD-MM-YYYY format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  // Fetch Merit List when year changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/admin/meritlist/${selectedYear}`)
      .then((res) => res.json())
      .then((data) => {
        // Sort students by percentage (Descending)
        const sortedStudents = data.sort((a, b) => b.percentage - a.percentage);
        setStudents(sortedStudents);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data.");
        console.error("Error fetching merit list:", err);
        setLoading(false);
      });
  }, [selectedYear]);

  // Generate PDF File
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Hostel Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Nagzira Boys Hostel, Sakoli", 60, 15);

    // Add Title
    doc.setFontSize(14);
    doc.text("Merit List", 90, 25);

    // Add Current Date
    doc.setFontSize(12);
    doc.text(`Date: ${getCurrentDate()}`, 150, 30);

    // Add Selected Year
    doc.text(`Year: ${selectedYear}`, 15, 30);

    // Define Table Columns
    let columns = ["S. No", "Full Name", "DOB", "Year", "Semester", "Branch", "Percentage", "Mobile"];
    if (selectedYear === 1) {
      columns.splice(5, 0, "Previous Education"); // Insert at correct position for First Year
    }

    // Define Table Rows
    const rows = students.map((student, index) => {
      let rowData = [
        index + 1, // Serial Number
        student.full_name,
        formatDate(student.date_of_birth),
        student.year,
        student.semester,
        student.branch,
        `${student.percentage}%`,
        student.mobile_number,
      ];

      if (selectedYear === 1) {
        rowData.splice(5, 0, student.education_type); // Insert Previous Education
      }

      return rowData;
    });

    // Add Table to PDF
    doc.autoTable({
      startY: 35,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }, // Green Header
    });

    // Save the PDF
    doc.save(`MeritList_Year${selectedYear}.pdf`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Merit List</h2>
      <p>Check the merit list and manage student rankings.</p>

      {/* Radio Buttons for Year Selection */}
      <div className={styles.radioButtons}>
        {[1, 2, 3].map((year) => (
          <label key={year} className={styles.radioLabel}>
            <input
              type="radio"
              value={year}
              checked={selectedYear === year}
              onChange={() => setSelectedYear(year)}
            />
            {year === 1 ? "First Year" : year === 2 ? "Second Year" : "Third Year"}
          </label>
        ))}
      </div>

      {/* Merit List Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <p className={styles.loadingText}>Loading merit list...</p>
        ) : error ? (
          <p className={styles.errorText}>{error}</p>
        ) : students.length > 0 ? (
          <table className={styles.meritTable}>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Full Name</th>
                <th>DOB</th>
                <th>Year</th>
                <th>Semester</th>
                {selectedYear === 1 && <th>Previous Education</th>}
                <th>Branch</th>
                <th>Percentage</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.full_name}</td>
                  <td>{formatDate(student.date_of_birth)}</td>
                  <td>{student.year}</td>
                  <td>{student.semester}</td>
                  {selectedYear === 1 && <td>{student.education_type}</td>}
                  <td>{student.branch}</td>
                  <td>{student.percentage}%</td>
                  <td>{student.mobile_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noDataText}>No data available for the selected year.</p>
        )}
      </div>

      {/* Download PDF Button */}
      <button className={styles.downloadBtn} onClick={generatePDF}>
        Download PDF
      </button>
    </div>
  );
};

export default meritlist;
