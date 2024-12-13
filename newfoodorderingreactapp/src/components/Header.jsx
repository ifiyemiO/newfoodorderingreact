import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Header() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/user">User List</Link>
          </li>
          <li>
            <Link to="/order">Order</Link>
          </li>
          <li>
            <Link to="/menu">Add New MenuItem To System</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
