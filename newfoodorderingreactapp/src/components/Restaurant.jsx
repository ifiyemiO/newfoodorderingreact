import React, { useState, useEffect } from "react";
import axios from "axios";

function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [showRestaurant, setShowRestaurant] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Track selected restaurant for update

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

  // Add or update a restaurant
  const handleAddOrUpdateRestaurant = async (e) => {
    e.preventDefault();

    const restaurantData = { name, location };

    if (selectedRestaurant) {
      // Update existing restaurant
      try {
        const response = await axios.put(
          `http://localhost:8080/New-FoodOrdering/restaurants/update/${selectedRestaurant.id}`,
          restaurantData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setMessage(`Restaurant "${response.data.name}" updated successfully!`);
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === selectedRestaurant.id ? response.data : restaurant
          )
        );
        setSelectedRestaurant(null); // Clear selection
      } catch (error) {
        console.error("Error updating restaurant:", error);
        setMessage(
          `Failed to update restaurant: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } else {
      // Add new restaurant
      try {
        const response = await axios.post(
          "http://localhost:8080/New-FoodOrdering/restaurants/add",
          restaurantData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setMessage(`Restaurant "${response.data.name}" added successfully!`);
        setRestaurants((prevRestaurants) => [
          ...prevRestaurants,
          response.data,
        ]);
      } catch (error) {
        console.error("Error adding restaurant:", error);
        setMessage(
          `Failed to add restaurant: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }

    setName("");
    setLocation("");
  };

  // Delete a restaurant
  const handleDeleteRestaurant = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/New-FoodOrdering/restaurants/delete/${id}`
      );
      setMessage("Restaurant deleted successfully!");
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== id)
      );
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      setMessage(
        `Failed to delete restaurant: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Edit a restaurant
  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setName(restaurant.name);
    setLocation(restaurant.location);
  };

  const handleShowRestaurant = () => {
    setShowRestaurant(true);
  };

  return (
    <div className="menu-container">
      {/* Form to Add or Update Restaurant */}
      <h2>
        {selectedRestaurant ? "Update Restaurant" : "Add a New Restaurant"}
      </h2>
      <form onSubmit={handleAddOrUpdateRestaurant}>
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
        <button type="submit">
          {selectedRestaurant ? "Update" : "Add"} Restaurant
        </button>
        {selectedRestaurant && (
          <button
            type="button"
            onClick={() => {
              setSelectedRestaurant(null);
              setName("");
              setLocation("");
            }}
          >
            Cancel
          </button>
        )}
        <br />
        <button type="button" onClick={handleShowRestaurant}>
          Show Restaurants
        </button>
      </form>

      {showRestaurant && (
        <table
          border="1"
          style={{ marginTop: "20px", width: "100%", textAlign: "left" }}
        >
          <thead>
            <h1>Restaurants</h1>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          {/* Display List of Restaurants */}
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>
                  <button onClick={() => handleEditRestaurant(restaurant)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant.id)}
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default Restaurant;
