import React, { useState, useEffect } from "react";
import styles from "./downloaddocuments.module.css"; // Ensure it's a CSS module

const downloaddocuments = () => {
  const [year, setYear] = useState("all");
  const [branch, setBranch] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, [year, branch, searchTerm]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/download-documents?year=${year}&branch=${branch}&search=${searchTerm}`
      );
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDownloadZip = (userId, fullName) => {
    const formattedName = fullName.replace(/\s+/g, "_"); // Convert spaces to underscores
    window.open(
      `http://localhost:3000/admin/download-documents/download-zip?userId=${userId}&name=${formattedName}`,
      "_blank"
    );
  };

  return (
    <div className={styles.downloadDocumentsContainer}>
      <h2 className={styles.headingPrimary}>📂 Download Documents</h2>

      {/* ✅ Filters Section */}
      <div className={styles.filters}>
        <div className={styles.radioGroup}>
          {["all", "1", "2", "3"].map((y) => (
            <label key={y}>
              <input
                type="radio"
                name="year"
                value={y}
                checked={year === y}
                onChange={() => setYear(y)}
              />
              {y === "all" ? "All" : `Year ${y}`}
            </label>
          ))}
        </div>

        <select
          className={styles.selectBox}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="all">All Branches</option>
          {["CM", "EE", "ME", "CE", "ETE"].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Table Section */}
      <div className={styles.tableContainer}>
        {documents.length > 0 ? (
          <table className={styles.documentTable}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Branch</th>
                <th>Education Type</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.full_name}</td>
                  <td>{doc.year}</td>
                  <td>{doc.semester}</td>
                  <td>{doc.branch}</td>
                  <td>{doc.education_type}</td>
                  <td>
                    <button
                      className={styles.downloadBtn}
                      onClick={() => handleDownloadZip(doc.id, doc.full_name)}
                    >
                      📥 Download ZIP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noRecords}>❌ No records found.</p>
        )}
      </div>
    </div>
  );
};

export default downloaddocuments;
