import React, { useState, useEffect } from "react";
import "./adminp.css"; // Import CSS
import MessExpences from "./messexpences";
import MessPayment from "./messpayment";
import Balanced from "./balanced"; 

const adminp = () => {
    const [showDashboard, setShowDashboard] = useState(false);
    const [activeComponent, setActiveComponent] = useState("dashboard");
    const [pendingPayments, setPendingPayments] = useState([]);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/payments");
            const data = await response.json();
            const filteredPayments = data.filter(payment => Payment.status === "Pending" && payment.upi_ref_number !== "Offline");
            setPendingPayments(filteredPayments);
        } catch (error) {
            console.error("❌ Error fetching pending payments:", error);
        }
    };

    const approvePayment = async (id) => {
        try {
            const response = await fetch("http://localhost:4000/api/approvePayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message);
                fetchPendingPayments(); // ✅ Refresh the list after approval
            }
        } catch (error) {
            console.error("❌ Error approving payment:", error);
        }
    };

    return (
        <div className="admin-container">
            <div className="sidebar">
                <h2 className="sidebar-title">NAGZIRA BOYS HOSTEL</h2>

                <button className="sidebar-btn" onClick={() => setShowDashboard(!showDashboard)}>
                    Dashboard ▼
                </button>

                {showDashboard && (
                    <div className="dropdown">
                        <button className="dropdown-btn" onClick={() => setActiveComponent("MessExpenses")}>MessExpenses</button>
                        <button className="dropdown-btn" onClick={() => setActiveComponent("MessPayment")}>MessPayment</button>
                    </div>
                )}

                
                <button className="sidebar-btn" onClick={() => setActiveComponent("Balanced")}>Balanced Payments</button> {/* ✅ Added Button */}
            </div>

            <div className="dashboard">
                {activeComponent === "dashboard" && (
                    <>
                        <div className="pending-payments">
                            <h3>Pending Online Payments</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>UPI Ref Number</th>
                                        <th>Payment Screenshot</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingPayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td>{payment.id}</td>
                                            <td>{payment.name}</td>
                                            <td>₹{payment.amount}</td>
                                            <td>{payment.upi_ref_number}</td>
                                            <td>
                                                {payment.payment_screenshot && payment.payment_screenshot !== "Offline" ? (
                                                    <a href={`http://localhost:4000/uploads/${payment.payment_screenshot}`} target="_blank" rel="noopener noreferrer">
                                                        <img src={`http://localhost:4000/uploads/${payment.payment_screenshot}`} alt="Payment Proof" width="50" height="50" />
                                                    </a>
                                                ) : (
                                                    "Offline Payment"
                                                )}
                                            </td>
                                            <td>
                                                <button className="approve-btn" onClick={() => approvePayment(payment.id)}>Approve</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {activeComponent === "MessExpenses" && <MessExpences />}
                {activeComponent === "MessPayment" && <MessPayment />}
                {activeComponent === "Balanced" && <Balanced />} {/* ✅ Added Balanced Component */}
            </div>
        </div>
    );
};

export default adminp;
