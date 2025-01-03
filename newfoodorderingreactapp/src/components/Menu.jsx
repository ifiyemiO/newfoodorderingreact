import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Menu() {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [editItemId, setEditItemId] = useState(null); // Track item being edited

  const categoryFromState = location.state?.category;
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");
  const selectedCategory = categoryFromState || categoryFromQuery;

  const filteredMenu = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/menu_items/all"
        );
        setMenuItems(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to fetch menu items. Please try again.");
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const newMenuItem = {
      name,
      description,
      price: parseFloat(price),
      category: inputCategory,
    };

    try {
      if (editItemId) {
        // Update existing item
        await axios.put(
          `http://localhost:8080/New-FoodOrdering/menu_items/update/${editItemId}`,
          newMenuItem,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setMessage(`Menu item "${name}" updated successfully!`);
        setEditItemId(null); // Reset edit mode
      } else {
        // Add new item
        const response = await axios.post(
          "http://localhost:8080/New-FoodOrdering/menu_items/add",
          newMenuItem,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setMessage(`Menu item "${response.data.name}" added successfully!`);
        setMenuItems((prevItems) => [...prevItems, response.data]);
      }
      setName("");
      setPrice("");
      setDescription("");
      setInputCategory("");
    } catch (error) {
      console.error("Error saving menu item:", error);
      setMessage("");
    }
  };

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  const handleEditMenuItem = (item) => {
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setInputCategory(item.category);
    setEditItemId(item.id); // Track the item being edited
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/New-FoodOrdering/menu_items/delete/${id}`
      );
      setMessage("Menu item deleted successfully!");
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
      setMessage("Failed to delete menu item.");
    }
  };

  return (
    <div className="menu-container">
      <h2>{editItemId ? "Edit Menu Item" : "Add a New Menu Item"}</h2>
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
            onChange={(e) => setInputCategory(e.target.value)}
            required
          />
        </label>
        <br />

        <button type="submit">
          {editItemId ? "Update Menu Item" : "Add Menu Item"}
        </button>
        <br />
        {!editItemId && <button onClick={handleShowMenu}>Show Menu</button>}
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showMenu && (
        <table
          border="1"
          style={{ marginTop: "20px", width: "100%", textAlign: "left" }}
        >
          <thead>
            <h1>Menu Items</h1>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.category}</td>
                <td>
                  <button onClick={() => handleEditMenuItem(item)}>Edit</button>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    style={{ marginLeft: "10px", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Menu;
