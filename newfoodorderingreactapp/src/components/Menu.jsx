import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Menu() {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inputCategory, setInputCategory] = useState(""); // Renamed state variable
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Extract category from location or query params
  const categoryFromState = location.state?.category; // From React Router state
  const queryParams = new URLSearchParams(location.search); // From query string
  const categoryFromQuery = queryParams.get("category"); // Extracted category

  // Determine which category to use
  const selectedCategory = categoryFromState || categoryFromQuery;

  // Filter menu items based on the selected category
  const filteredMenu = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

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
      description,
      price: parseFloat(price),
      category: inputCategory, // Use renamed state variable
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
      setDescription("");
      setInputCategory(""); // Reset category input
    } catch (error) {
      console.error("Error adding menu item:", error);
      setMessage("");
    }
  };

  return (
    <div className="menu-container">
      <h1>Menu Items</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {filteredMenu.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>${item.price.toFixed(2)}</p>
            <p>Category: {item.category}</p>
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
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

        <label>
          Category:
          <input
            type="text"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)} // Updated inputCategory
            required
          />
        </label>
        <br />

        <button type="submit">Add Menu Item</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default Menu;
