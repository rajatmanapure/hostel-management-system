const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads")); // Serve uploaded images

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage });

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "payment",
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

// Serve Uploaded Images
app.get("/uploads/:filename", (req, res) => {
    res.sendFile(path.join(__dirname, "uploads", req.params.filename));
});

// Fetch Payments
app.get("/api/payments", (req, res) => {
    db.query("SELECT * FROM tb_pay ORDER BY id DESC", (err, results) => {
        if (err) {
            console.error("❌ Error fetching payments:", err);
            return res.status(500).json({ error: "❌ Error fetching payments!" });
        }
        res.json(results);
    });
});

// Add Payment
app.post("/api/addPayment", upload.single("payment_screenshot"), (req, res) => {
    console.log("📩 Received Data in /api/addPayment:", req.body);

    const { user_id, name, branch, year, amount, installment, date, upi_ref_number } = req.body;
    const paymentScreenshot = req.file ? req.file.filename : "Offline";

    if (!user_id || !name || !branch || !year || !amount || !installment || !date) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    const isOffline = !upi_ref_number || upi_ref_number === "Offline"; 
    const status = isOffline ? "Completed" : "Pending";  // ✅ Pending for online payments
    const upiRef = isOffline ? "Offline" : upi_ref_number;

    const query = `INSERT INTO tb_pay (user_id, name, branch, year, amount, installment, date, upi_ref_number, status, payment_screenshot) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [user_id, name, branch, year, amount, installment, date, upiRef, status, paymentScreenshot];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ error: "❌ Database Error!" });
        }
        res.json({ message: "✅ Payment Added! Awaiting Admin Approval." });
    });
});

// Approve Payment
app.post("/api/approvePayment", (req, res) => {
    const { id } = req.body;
    const query = `UPDATE tb_pay SET status='Completed' WHERE id=?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ Error updating payment status:", err);
            return res.status(500).json({ error: "❌ Database Error!" });
        }
        res.json({ message: "✅ Payment Approved!" });
    });
});
// ✅ Fetch students with pending payments (Grouped by Branch)
app.get("/api/remainingPayments", (req, res) => {
    const query = `
        SELECT id, user_id, name, branch, year, 
               amount AS total_amount, 
               (amount - COALESCE(SUM(installment), 0)) AS remaining_amount,
               COALESCE(SUM(installment), 0) AS paid_amount
        FROM tb_pay 
        GROUP BY id, user_id, name, branch, year, amount
        HAVING remaining_amount > 0
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("❌ Error fetching remaining payments:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});


// Fetch Mess Expenses & Total Collected Amount
app.get("/api/mess_expenses", (req, res) => {
    const queryExpenses = `SELECT * FROM mess_exp ORDER BY id DESC`;
    const queryTotalCollected = `SELECT SUM(amount) AS totalCollected FROM tb_pay WHERE status='Completed'`;

    db.query(queryExpenses, (err, expenses) => {
        if (err) {
            console.error("❌ Error fetching expenses:", err);
            return res.status(500).json({ error: "❌ Error fetching expenses!" });
        }

        db.query(queryTotalCollected, (err, result) => {
            if (err) {
                console.error("❌ Error fetching total collected:", err);
                return res.status(500).json({ error: "❌ Error fetching total collected!" });
            }
            const totalCollected = result[0].totalCollected || 0;
            res.json({ expenses, totalCollected });
        });
    });
});

// Add New Mess Expense
app.post("/api/addExpense", (req, res) => {
    console.log("📩 Received Expense Data:", req.body);

    const { name, purpose, amount, date, total, remainexp, exp_amount } = req.body;

    if (!name || !purpose || !amount || !date) {
        console.log("❌ Missing Fields in Expense Submission!");
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    const query = `INSERT INTO mess_exp (name, purpose, amount, date, total, remainexp, exp_amount) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, purpose, amount, date, total, remainexp, exp_amount];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("❌ Database Error while adding expense:", err);
            return res.status(500).json({ error: "❌ Database Error!" });
        }
        console.log("✅ Expense Added Successfully!", result);
        res.json({ message: "✅ Expense Added Successfully!" });
    });
});

// Properly close MySQL connection on server exit
process.on("SIGINT", () => {
    console.log("🔌 Closing database connection...");
    db.end((err) => {
        if (err) console.error("❌ Error closing DB:", err);
        process.exit();
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
