import React, { useState, useEffect } from "react";
import "./balanced.css";

const TOTAL_AMOUNT = 20000; // ✅ Fixed total amount

const Balanced = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");

    useEffect(() => {
        fetchRemainingPayments();
    }, []);

    const fetchRemainingPayments = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/remainingPayments"); // ✅ Ensure this matches backend
            const data = await response.json();

            if (data.length === 0) {
                setStudents([]);
                setDepartments([]);
                return;
            }

            // ✅ Calculate remaining amount dynamically
            const updatedStudents = data.map(student => ({
                ...student,
                remaining_amount: TOTAL_AMOUNT - student.paid_amount
            }));

            // ✅ Filter students who have remaining payments
            const unpaidStudents = updatedStudents.filter(student => student.remaining_amount > 0);
            setStudents(unpaidStudents);
            
            // ✅ Extract unique departments dynamically
            const uniqueDepartments = [...new Set(unpaidStudents.map(student => student.branch))];
            setDepartments(uniqueDepartments);
        } catch (error) {
            console.error("❌ Error fetching remaining payments:", error);
        }
    };

    // ✅ Filter students based on selected department
    const filteredStudents = selectedDepartment
        ? students.filter(student => student.branch === selectedDepartment)
        : students;

    return (
        <div className="balanced-container">
            <h2>Balanced Payments</h2>
            
            <div className="filter-section">
                <label htmlFor="department">Select Department:</label>
                <select id="department" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    <option value="">All Departments</option>
                    <option value="CM">CM</option>
                    <option value="CE">CE</option>
                    <option value="ME">ME</option>
                    <option value="EE">EE</option>
                    <option value="ETC">ETC</option>
                    {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>
            
            {filteredStudents.length === 0 ? (
                <p className="no-payments">✅ No pending payments for this department.</p>
            ) : (
                <table className="balanced-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Paid Amount</th>
                            <th>Remaining Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.branch}</td>
                                <td>{student.year}</td>
                                <td>₹{student.paid_amount}</td>
                                <td className={student.remaining_amount > 0 ? "unpaid" : "paid"}>
                                    ₹{student.remaining_amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Balanced;
