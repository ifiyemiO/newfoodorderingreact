import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Order() {
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]); // Filtered menu based on category
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();

  // Fetch order history from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/orders/all"
        );
        setOrders(response.data);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch order history. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  // Dummy food items for filtering
  const foodItems = [
    { id: 1, name: "Cheese Burger", category: "burgers", price: 5.99 },
    { id: 2, name: "Hawaiian Pizza", category: "pizza", price: 8.99 },
    { id: 3, name: "Croissant", category: "baked-goods", price: 2.99 },
    { id: 4, name: "Cappuccino", category: "beverages", price: 3.99 },
  ];

  useEffect(() => {
    // Filter the food items based on the category in the URL state
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      const filtered = foodItems.filter((item) => item.category === category);
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(foodItems); // Default to all items if no category is passed
    }
  }, [location]);

  const handleAddToOrder = (item) => {
    setOrderItems([...orderItems, item]);
    console.log(`Added ${item.name} to order`);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const order = {
      customerName,
      items: orderItems,
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
    <div className="order-container">
      {/* Order Form */}
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
          <button type="submit">Submit Order</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      {/* Filtered Menu */}
      <div className="menu-section">
        <h1>Menu</h1>
        {filteredMenu.map((item) => (
          <div key={item.id}>
            <p>
              {item.name} - ${item.price.toFixed(2)}
              <button onClick={() => handleAddToOrder(item)}>
                Add to Order
              </button>
            </p>
          </div>
        ))}
      </div>

      {/* Order History */}
      <div>
        <h1>Order History</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Order Date</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Order;
