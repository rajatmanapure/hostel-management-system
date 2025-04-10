import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./messpayment.css";

const messpayment = () => {
    const [paymentType, setPaymentType] = useState("Online");
    const [payments, setPayments] = useState([]);
    const [formData, setFormData] = useState({
        userId: "",
        name: "",
        branch: "",
        year: "",
        amount: "",
        installment: "",
    });

    const offlineFormRef = useRef(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (paymentType === "Offline" && offlineFormRef.current) {
            setTimeout(() => {
                offlineFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 200);
        }
    }, [paymentType]);

    const fetchPayments = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/payments");
            setPayments(response.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const handlePaymentTypeChange = (e) => {
        setPaymentType(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        if (!formData.userId || !formData.name || !formData.branch || !formData.year || !formData.amount || !formData.installment) {
            alert("❌ Please fill all fields!");
            return;
        }

        const currentDate = new Date().toISOString().split("T")[0];

        try {
            await axios.post("http://localhost:4000/api/addPayment", {
                user_id: formData.userId,
                name: formData.name,
                branch: formData.branch,
                year: formData.year,
                amount: formData.amount,
                installment: formData.installment,
                date: currentDate,
                mode: paymentType,
                uupi_ref_number: paymentType === "Offline" ? "Offline" : formData.upiRefNumber || "N/A",
                status: paymentType === "Offline" ? "Completed" : "Pending",
                payment_screenshot: paymentType === "Offline" ? "Offline" : formData.paymentScreenshot || "N/A",
                
            });

            alert("✅ Payment Added!");
            setFormData({ userId: "", name: "", branch: "", year: "", amount: "", installment: "" });
            fetchPayments();
        } catch (error) {
            console.error("Error adding payment:", error);
            alert("❌ Failed to add payment. Try again!");
        }
    };

    return (
        <div className="mess-payment-container">
            <h2>Mess Payment Details</h2>

            <div className="payment-type-selection">
                <label>Select Payment Type: </label>
                <select value={paymentType} onChange={handlePaymentTypeChange}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                </select>
            </div>

            <table className="mess-payment-table">
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>Year</th>
                        <th>Amount</th>
                        <th>Installment</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Payment Mode</th>
                        <th>Payment Screenshot</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.user_id}</td>
                            <td>{entry.name}</td>
                            <td>{entry.branch}</td>
                            <td>{entry.year}</td>
                            <td>₹{entry.amount}</td>
                            <td>{entry.installment}</td>
                            <td>{entry.date}</td>
                            <td className={entry.status === "Completed" ? "completed-status" : "pending-status"}>
                                {entry.status || "Completed"}
                            </td>
                            <td className={entry.upi_ref_number === "Offline" ? "offline-mode" : "online-mode"}>
                                {entry.upi_ref_number === "Offline" ? "Offline" : "Online"}
                            </td>
                            <td>
                                {entry.payment_screenshot === "Offline" ? (
                                    "Offline"
                                ) : (
                                    <a href={`http://localhost:4000/uploads/${entry.payment_screenshot}`} target="_blank" rel="noopener noreferrer">
                                        <img src={`http://localhost:4000/uploads/${entry.payment_screenshot}`} alt="Payment Proof" width="50" height="50" />
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {paymentType === "Offline" && (
                <div className="add-payment-form" ref={offlineFormRef}>
                    <h3>➕ Add Offline Payment</h3>
                    <form onSubmit={handleAddPayment}>
                        <input type="text" name="userId" placeholder="User ID" value={formData.userId} onChange={handleInputChange} required />
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                        <input type="text" name="branch" placeholder="Branch" value={formData.branch} onChange={handleInputChange} required />
                        <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} required />
                        <input type="number" name="amount" placeholder="Amount (₹)" value={formData.amount} onChange={handleInputChange} required />
                        <input type="text" name="installment" placeholder="Installment" value={formData.installment} onChange={handleInputChange} required />
                        <button type="submit">Add Offline Payment</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default messpayment;
