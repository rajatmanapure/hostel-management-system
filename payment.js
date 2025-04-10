import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./payment.module.css";
import { QRCodeCanvas } from "qrcode.react";

const payment = () => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [amount, setAmount] = useState("");
  const [installment, setInstallment] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [upiRefNumber, setUpiRefNumber] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!userId || !name || !branch || !year || !amount || !installment) {
      alert("❌ Please fill all fields!");
      return;
    }
    setShowQR(true);
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const confirmOnlinePayment = async () => {
    if (!upiRefNumber) {
      alert("❌ Please enter the UPI Reference Number!");
      return;
    }
    
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("name", name);
    formData.append("branch", branch);
    formData.append("year", year);
    formData.append("amount", amount);
    formData.append("installment", installment);
    formData.append("date", new Date().toISOString().split("T")[0]);
    formData.append("upi_ref_number", upiRefNumber);
    if (screenshot) {
      formData.append("payment_screenshot", screenshot);
    }

    try {
      const response = await axios.post("http://localhost:4000/api/addPayment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      navigate("/dining");
    } catch (error) {
      alert(error.response?.data?.error || "❌ Payment verification failed!");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Make a Payment</h2>

      <input type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} className={styles.input} />
      <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />
      <input type="text" placeholder="Enter Branch" value={branch} onChange={(e) => setBranch(e.target.value)} className={styles.input} />
      <input type="number" placeholder="Enter Year" value={year} onChange={(e) => setYear(e.target.value)} className={styles.input} />
      <input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={styles.input} />

      <select value={installment} onChange={(e) => setInstallment(e.target.value)} className={styles.input}>
        <option value="">Select Installment</option>
        <option value="1st Inst">1st Installment</option>
        <option value="2nd Inst">2nd Installment</option>
      </select>

      <button onClick={handlePayment} className={styles.button}>Proceed with Payment</button>

      {showQR && (
        <div className={styles.qrContainer}>
          <QRCodeCanvas value={`upi://pay?pa=8999717032@pz&pn=Sarthak Hursad&am=${amount}&cu=INR&tn=UserID:${userId}%20Installment:${installment}`} size={200} />
          <p className={styles.warning}>Scan QR to make payment.</p>

          <input type="text" placeholder="Enter UPI Ref Number" value={upiRefNumber} onChange={(e) => setUpiRefNumber(e.target.value)} className={styles.input} />
          &nbsp;
          <input type="file" accept="image/*" onChange={handleFileChange} className={styles.input} />
          &nbsp;
          <button onClick={confirmOnlinePayment} className={styles.button}>Confirm Payment</button>
        </div>
      )}
    </div>
  );
};

export default payment;
