import React, { useEffect, useState } from "react";
import styles from "./exp.module.css";  // ✅ Correct CSS Import

const MessExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalCollected, setTotalCollected] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [newExpense, setNewExpense] = useState({
        name: "",
        purpose: "",
        amount: "",
        date: "",
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    // ✅ Fetch expenses from backend
    const fetchExpenses = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/mess_expenses");
            const data = await response.json();
            setExpenses(data.expenses);
            setTotalCollected(data.totalCollected);

            const totalExp = data.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
            setTotalExpenses(totalExp);
            setRemainingAmount(data.totalCollected - totalExp);
        } catch (error) {
            console.error("❌ Error fetching mess expenses:", error);
        }
    };

    const handleChange = (e) => {
        setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newExpense.name || !newExpense.purpose || !newExpense.amount || !newExpense.date) {
            alert("❌ All fields are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/api/addExpense", {  // ✅ FIXED API URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newExpense,
                    amount: Number(newExpense.amount), // Ensure amount is a number
                    total: totalCollected, // ✅ Added to match your database
                    remainexp: remainingAmount - Number(newExpense.amount),
                    exp_amount: totalExpenses + Number(newExpense.amount),
                }),
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message);
                
                // ✅ Clear form fields after successful submission
                setNewExpense({ name: "", purpose: "", amount: "", date: "" });
                
                fetchExpenses(); // ✅ Refresh expenses
            }
        } catch (error) {
            console.error("❌ Error adding expense:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>💰 Mess Expenses</h2>

            {/* ✅ Financial Summary Section */}
            <div className={styles.summaryContainer}>
                <div className={`${styles.summaryBox} ${styles.totalCollected}`}>
                    <h3>Total Collected</h3>
                    <p>₹{totalCollected}</p>
                </div>
                <div className={`${styles.summaryBox} ${styles.totalExpenses}`}>
                    <h3>Total Expenses</h3>
                    <p>₹{totalExpenses}</p>
                </div>
                <div className={`${styles.summaryBox} ${styles.remainingAmount}`}>
                    <h3>Remaining Amount</h3>
                    <p>₹{remainingAmount}</p>
                </div>
            </div>

            {/* ✅ Expenses Table */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Purpose</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr key={expense.id}>
                            <td>{index + 1}</td>
                            <td>{expense.name}</td>
                            <td>{expense.purpose}</td>
                            <td>₹{expense.amount}</td>
                            <td>{expense.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Add New Expense Form */}
            <h3>➕ Add New Expense</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Person Name"
                        value={newExpense.name}
                        onChange={handleChange}
                        className={styles.inputField}
                        required
                    />
                    <input
                        type="text"
                        name="purpose"
                        placeholder="Purpose"
                        value={newExpense.purpose}
                        onChange={handleChange}
                        className={styles.inputField}
                        required
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount (₹)"
                        value={newExpense.amount}
                        onChange={handleChange}
                        className={styles.inputField}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={newExpense.date}
                        onChange={handleChange}
                        className={styles.inputField}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Add Expense</button>
            </form>
        </div>
    );
};

export default MessExpenses;
