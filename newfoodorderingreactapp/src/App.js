import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Order from "./components/Order";
import User from "./components/User";
import AboutUs from "./components/AboutUs";
import Welcome from "./components/Welcome";
import { fetchMenuItems } from "./utils/apicalls";

function App() {
  const [menuItems, setMenuItems] = useState([]);

  // fetch menu items from the API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/menu_items/all"
        );
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const data = await fetchMenuItems(); // Call the imported fetchMenu function
        setMenuItems(data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    getMenuItems(); // Execute the fetch
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Welcome to Cafe Delight</h1>
        </header>
        <nav className="navbar">
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <a href="#about-us">About Us</a>
              </li>
              <li>
                <Link to="/menu">Menu</Link>
              </li>
              <li>
                <Link to="/order">Order</Link>
              </li>
              <li>
                <Link to="/user">Users</Link>
              </li>
            </ul>
          </nav>
        </nav>
      </div>
      <Routes>
        <Route path="/home" element={<Welcome />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/menu" element={<Menu menu={menuItems} />} />
        <Route path="/order" element={<Order />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
