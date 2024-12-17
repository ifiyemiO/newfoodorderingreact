import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
// import "./App.css";

function Menu() {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Define filteredMenu based on category
  const [searchCategory, setSearchCategory] = useState("");
  const filteredMenu = searchCategory
    ? menuItems.filter((item) => item.category === searchCategory)
    : menuItems;

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category"); // e.g., "burgers"

  // Filter menu items based on the category
  const filteredItems = category
    ? filteredMenu.filter((item) => item.category === category)
    : filteredMenu;

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
      setMessage("");
    }
  };

  return (
    <div className="centered-container">
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
        <p>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </p>
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
