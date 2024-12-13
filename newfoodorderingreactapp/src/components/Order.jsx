import React, { useState } from "react";
import axios from "axios";
// import "../App.css";
// import "./App.css";

function Order() {
  const [customerName, setCustomerName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const order = {
      customerName,
      totalAmount: parseFloat(totalAmount),
      orderDate: new Date().toISOString(),
    };

    try {
      await axios.post(
        "http://localhost:8080/New-FoodOrdering/orders/add",
        order
      );
      setMessage("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
      setMessage("Error submitting order.");
    }
  };

  return (
    <div className="centered-container">
      <div>
        <h1>Place an Order</h1>
        <form onSubmit={handleOrderSubmit}>
          <label>
            Customer Name:
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Total Amount:
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit Order</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Order;
