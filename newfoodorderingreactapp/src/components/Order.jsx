import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Order() {
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/orders/all"
        );
        console.log(response.data); // Debugging: Check totalAmount here
        setOrders(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch order history. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/menu_items/all"
        );
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to fetch menu items. Please try again.");
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      const filtered = menuItems.filter((item) => item.category === category);
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(menuItems);
    }
  }, [location, menuItems]);

  const handleAddToOrder = (item, quantity) => {
    if (quantity <= 0) return;

    const existingItem = orderItems.find(
      (orderItem) => orderItem.id === item.id
    );
    let updatedOrderItems;

    if (existingItem) {
      updatedOrderItems = orderItems.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + quantity }
          : orderItem
      );
    } else {
      updatedOrderItems = [...orderItems, { ...item, quantity }];
    }

    setOrderItems(updatedOrderItems);

    const newTotalAmount = updatedOrderItems.reduce(
      (total, orderItem) => total + orderItem.price * orderItem.quantity,
      0
    );
    setTotalAmount(newTotalAmount);
  };

  const handleDeleteItem = (id) => {
    const updatedOrderItems = orderItems.filter((item) => item.id !== id);
    setOrderItems(updatedOrderItems);

    const newTotalAmount = updatedOrderItems.reduce(
      (total, orderItem) => total + orderItem.price * orderItem.quantity,
      0
    );
    setTotalAmount(newTotalAmount);
  };

  const handleCancelOrder = () => {
    setOrderItems([]);
    setTotalAmount(0);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const order = {
      customerName,
      items: orderItems,
      orderDate: new Date().toISOString(),
      totalAmount, // Include totalAmount explicitly
    };

    try {
      await axios.post(
        "http://localhost:8080/New-FoodOrdering/orders/add",
        order
      );
      setMessage("Order submitted successfully!");
      setOrderItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error submitting order:", error);
      setMessage("Error submitting order.");
    }
  };

  const handleShowOrderHistory = () => {
    setShowOrderHistory(true);
  };

  return (
    <div className="order-container">
      <div className="form-section">
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
          <button type="submit" disabled={orderItems.length === 0}>
            Submit Order
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>

      {/* Menu Items */}
      <div
        className="menu-section"
        style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              width: "250px",
              textAlign: "center",
            }}
          >
            <img
              src={item.imageUrl || "https://via.placeholder.com/150"}
              alt={item.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h3>{item.name}</h3>
            <p>Price: ${item.price.toFixed(2)}</p>
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                defaultValue="1"
                style={{ width: "60px", marginLeft: "10px" }}
                id={`quantity-${item.id}`}
              />
            </label>
            <br />
            <button
              onClick={() =>
                handleAddToOrder(
                  item,
                  parseInt(
                    document.getElementById(`quantity-${item.id}`).value || "1"
                  )
                )
              }
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add to Order
            </button>
          </div>
        ))}
      </div>

      {/* Order Review */}
      <div className="order-review">
        <h2>Order Review</h2>
        {orderItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: "right" }}>
                  Total Amount:
                </td>
                <td colSpan="2">${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No items in the order.</p>
        )}
        {orderItems.length > 0 && (
          <button onClick={handleCancelOrder} style={{ marginTop: "10px" }}>
            Cancel Order
          </button>
        )}
      </div>

      {/* Order History */}
      <div>
        <button onClick={handleShowOrderHistory}>Show Order History</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {orders.length > 0 ? (
          showOrderHistory && (
            <table>
              <thead>
                <h1>Order History</h1>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Order;
