import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./App.css";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch menu items from the backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/menu_items/all"
        );
        setMenuItems(response.data);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to fetch menu items. Please try again.");
      }
    };

    fetchMenuItems();
  }, []);

  // Handle form submission to add a new menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const newMenuItem = {
      name,
      price: parseFloat(price),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/New-FoodOrdering/menu_items/add",
        newMenuItem,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage(`Menu item "${response.data.name}" added successfully!`);
      setMenuItems((prevItems) => [...prevItems, response.data]);
      setName("");
      setPrice("");
    } catch (error) {
      console.error("Error adding menu item:", error);
      setMessage("Failed to add menu item. Please try again.");
    }
  };

  return (
    <div className="centered-container">
      <h1>Menu Items</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="menu-item">
            <img
              src={
                item.imageUrl || "http://localhost:8080/images/placeholder.jpg"
              }
              alt={item.name}
              className="menu-item-image"
            />
            <div>
              <strong>{item.name}</strong>: ${item.price.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
      <h2>Add a New Menu Item</h2>
      <form onSubmit={handleAddMenuItem}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Menu Item</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}{" "}
      {/* Display message */}
    </div>
  );
}

export default Menu;
