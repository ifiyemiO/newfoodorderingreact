import React, { useEffect, useState } from "react";
import axios from "axios";

function User() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleShowUser = () => {
    setShowUser(true); // Show user list when the button is clicked
  };

  // Populate update form with selected user's data
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
  };

  // Update user details
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    const updatedUser = { name, email, phoneNumber };

    try {
      const response = await axios.put(
        `http://localhost:8080/New-FoodOrdering/users/update/${selectedUser.id}`,
        updatedUser
      );
      setMessage(`User "${response.data.name}" updated successfully!`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );
      setSelectedUser(null); // Clear selected user
      setName("");
      setEmail("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage(
        `Failed to update user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:8080/New-FoodOrdering/users/delete/${userId}`
      );
      setMessage("User deleted successfully!");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Remove from local list
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage(
        `Failed to delete user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="home-container">
      <div>
        {/* Form to Add or Update User */}
        <h2>{selectedUser ? "Update User" : "Add a New User"}</h2>
        <form onSubmit={selectedUser ? handleUpdateUser : handleAddUser}>
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
          <button type="submit">
            {selectedUser ? "Update User" : "Add User"}
          </button>
          <br />
          <button onClick={handleShowUser}>Show Users</button>
        </form>
        {selectedUser && (
          <button onClick={() => setSelectedUser(null)}>Cancel Update</button>
        )}
        <br />

        {/* Display List of Users */}
        {users.length > 0 ? (
          showUser && (
            <table
              border="1"
              style={{ marginTop: "20px", width: "100%", textAlign: "left" }}
            >
              <thead>
                <h2>User List</h2>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <button onClick={() => handleEditUser(user)}>Edit</button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <p>No users found.</p>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default User;
