import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import burgersImg from "../images/burger.jpg";
import pizzaImg from "../images/pizza.jpg";
import beveragesImg from "../images/coffee-tea.jpg";
import bakedGoodsImg from "../images/baked-goods.jpg";

function Welcome() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Navigate to the Order page and pass category as query parameter
    navigate(`/order?category=${category}`);
  };

  return (
    <div className="home-container">
      <p>Select a category to view menu items:</p>
      <div className="categories">
        {/* Burgers */}
        <Link
          to="/order"
          state={{ category: "burgers" }}
          className="category-link"
        >
          <img src={burgersImg} alt="Burgers" className="category-image" />
          <h3>Burgers</h3>
        </Link>

        {/* Pizza */}
        <Link to="/menu/pizza" className="category-link">
          <img src={pizzaImg} alt="Pizza" className="category-image" />
          <h3>Pizza</h3>
        </Link>

        {/* Beverages */}
        <Link to="/menu/beverages" className="category-link">
          <img src={beveragesImg} alt="Beverages" className="category-image" />
          <h3>Beverages</h3>
        </Link>

        {/* Baked Goods */}
        <Link to="/menu/baked-goods" className="category-link">
          <img
            src={bakedGoodsImg}
            alt="Baked Goods"
            className="category-image"
          />
          <h3>Baked Goods</h3>
        </Link>
      </div>

      {/* About Us Section */}
      <div id="about-us" className="about-us">
        <h1>About Us</h1>
        <p>
          Team Members Sireesha, Ifunanya and Ifiyemi have developed a food
          ordering App using spring boot at the backend and React at the
          Frontend..
        </p>
      </div>
    </div>
  );
}

export default Welcome;
