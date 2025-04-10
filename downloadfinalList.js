import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from './downloadfinallist.module.css';

const DownloadFinalList = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const fetchData = (year) => {
    const url = year
      ? `http://localhost:3000/admin/downloadfinal-list?year=${year}`
      : 'http://localhost:3000/admin/downloadfinal-list';
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Error fetching data:', err));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const yearText = selectedYear ? `Year: ${selectedYear}` : 'All Years';

    doc.text(`Final List of Hostel Booked Students (${yearText})`, 14, 20);
    doc.text(`Date: ${currentDate}`, 14, 30);

    const columns = [
      'S. No', 'Full Name', 'DOB', 'Year', 'Semester',
      ...(selectedYear === '1' ? ['Previous Education'] : []),
      'Branch', 'Percentage', 'Mobile'
    ];

    const rows = data.map((item, index) => [
      index + 1,
      item.full_name,
      item.date_of_birth,
      item.year,
      item.semester,
      ...(selectedYear === '1' ? [item.education_type] : []),
      item.branch,
      `${item.percentage}%`,
      item.mobile_number
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
    });

    const fileName = selectedYear ? `Hostel_Booked_List_Year_${selectedYear}.pdf` : 'Hostel_Booked_List_All_Years.pdf';
    doc.save(fileName);
  };

  return (
    <div className={styles.downloadFinalListPage}>
      <h2 className={styles.heading}>Download Final List</h2>

      <div className={styles.filterContainer}>
        <label htmlFor="yearSelect">Filter by Year: </label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={styles.selectInput}
        >
          <option value="">All Years</option>
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
        </select>
        <button className={styles.downloadBtn} onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Full Name</th>
              <th>DOB</th>
              <th>Year</th>
              <th>Semester</th>
              {selectedYear === '1' && <th>Previous Education</th>}
              <th>Branch</th>
              <th>Percentage</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.full_name}</td>
                <td>{item.date_of_birth}</td>
                <td>{item.year}</td>
                <td>{item.semester}</td>
                {selectedYear === '1' && <td>{item.education_type}</td>}
                <td>{item.branch}</td>
                <td>{item.percentage}%</td>
                <td>{item.mobile_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DownloadFinalList;
