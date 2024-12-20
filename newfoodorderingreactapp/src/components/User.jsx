import React, { useEffect, useState } from "react";
import axios from "axios";

function User() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/New-FoodOrdering/users/all"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    const newUser = { name, email, phoneNumber };

    try {
      const response = await axios.post(
        "http://localhost:8080/New-FoodOrdering/users/add",
        newUser
      );
      setMessage(`User "${response.data.name}" added successfully!`);
      setUsers((prevUsers) => [...prevUsers, response.data]); // Update the local list
      setName("");
      setEmail("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage(
        `Failed to add user: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="home-container">
      <div>
        {/* Display List of Users */}
        <h2>User List</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phoneNumber}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}

        {/* Form to Add User */}
        <h2>Add a New User</h2>
        <form onSubmit={handleAddUser}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <p>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </p>

          <label>
            Phone Number:
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Add User</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default User;
