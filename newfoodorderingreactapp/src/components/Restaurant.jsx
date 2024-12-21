import React, { useState, useEffect } from "react";
import axios from "axios";

function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/restaurants/all"
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setMessage("Failed to fetch restaurants. Please try again.");
      }
    };

    fetchRestaurants();
  }, []);

  // Add a new restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const newRestaurant = { name, location };

    try {
      const response = await axios.post(
        "http://localhost:8080/restaurants/add",
        newRestaurant,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage(`Restaurant "${response.data.name}" added successfully!`);
      setRestaurants((prevRestaurants) => [...prevRestaurants, response.data]);
      setName("");
      setLocation("");
    } catch (error) {
      console.error("Error adding restaurant:", error);
      setMessage(
        `Failed to add restaurant: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="centered-container">
      <h1>Restaurants</h1>

      {/* Display List of Restaurants */}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <h3>{restaurant.name}</h3>
            <p>Location: {restaurant.location}</p>
          </li>
        ))}
      </ul>

      {/* Form to Add New Restaurant */}
      <h2>Add a New Restaurant</h2>
      <form onSubmit={handleAddRestaurant}>
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
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Restaurant</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Restaurant;
