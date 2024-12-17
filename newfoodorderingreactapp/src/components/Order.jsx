import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import cheeseBurgerImg from "../images/CHEESEBURGER_01.jpg";
import jrBurgerImg from "../images/JR_BURGER.jpg";
import veggieBurgerImg from "../images/VEGGIE_BURGER.jpg";
import hawaiianPizzaImg from "../images/HAWAIIAN_PIZZA.jpg";
import pizza01Img from "../images/PIZZA_01.jpg";
import pizza02Img from "../images/PIZZA_02.png";
import coffeeTeaImg from "../images/coffee-tea.jpg";
import hotChocolateImg from "../images/HOT_CHOCOLATE.jpg";
import croissantImg from "../images/CROISSANT.jpg";
import donutImg from "../images/DONUT_01.jpg";
import cookieImg01 from "../images/COOKIE_01.jpg";
import cookieImg02 from "../images/TEA_BISCUIT.jpg";
import cappucinnoImg from "../images/CAPPUCCINO.jpg";

function Order() {
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]); // Filtered menu based on category
  const [orderItems, setOrderItems] = useState([]);
  const location = useLocation();

  // All food items
  const foodItems = [
    {
      id: 1,
      name: "Cheeseburger",
      price: 5.99,
      description: "Classic burger with cheese",
      image: cheeseBurgerImg,
    },
    {
      id: 2,
      name: "Junior Burger",
      price: 4.49,
      description: "Smaller burger for kids",
      image: jrBurgerImg,
    },
    {
      id: 3,
      name: "Veggie Burger",
      price: 5.49,
      description: "Fresh veggie burger",
      image: veggieBurgerImg,
    },
    {
      id: 4,
      name: "Ham Burger",
      price: 6.49,
      description: "Burger with ham and fresh toppings.",
      image: veggieBurgerImg,
    },

    // Pizzas
    {
      id: 5,
      name: "Hawaiian Pizza",
      price: 10.99,
      description: "Pineapple and ham",
      image: hawaiianPizzaImg,
    },
    {
      id: 6,
      name: "Pizza Special",
      price: 8.99,
      description: "Loaded with cheese and toppings",
      image: pizza01Img,
    },
    {
      id: 7,
      name: "Pepperoni Pizza",
      price: 9.49,
      description: "Topped with pepperoni",
      image: pizza02Img,
    },
    {
      id: 8,
      name: "Cheese Pizza",
      price: 8.49,
      description: "Classic cheese pizza",
      image: pizza02Img,
    },

    // Beverages
    {
      id: 9,
      name: "Latte",
      price: 2.99,
      description: "Smooth espresso with steamed milk",
      image: coffeeTeaImg,
    },
    {
      id: 10,
      name: "Hot Chocolate",
      price: 3.49,
      description: "Creamy hot chocolate",
      image: hotChocolateImg,
    },
    {
      id: 11,
      name: "Cappuccino",
      price: 3.99,
      description: "Espresso with frothy milk",
      image: cappucinnoImg,
    },

    // Baked Goods
    {
      id: 12,
      name: "Croissant",
      price: 2.99,
      description: "Buttery and flaky",
      image: croissantImg,
    },
    {
      id: 13,
      name: "Donut",
      price: 1.99,
      description: "Sweet glazed donut",
      image: donutImg,
    },
    {
      id: 14,
      name: "Cookie - Choco",
      price: 1.49,
      description: "Chocolate chip cookie",
      image: cookieImg01,
    },
    {
      id: 15,
      name: "Tea Bun",
      price: 1.29,
      description: "Sweet buns perfect with tea",
      image: cookieImg02,
    },
  ];

  useEffect(() => {
    // Filter the food items based on the category in the URL state
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      const filtered = foodItems.filter((item) => item.category === category);
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(foodItems); // Default to all items if no category is passed
    }
  }, [location, foodItems]);

  const handleAddToOrder = (item) => {
    setOrderItems([...orderItems, item]);
    //setTotalAmount((prev) => prev + item.price);
    console.log(`Added ${item.name} to order`);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const order = {
      customerName,
      //totalAmount: parseFloat(totalAmount),
      items: orderItems,
      orderDate: new Date().toISOString(),
    };

    try {
      await axios.post(
        "http://localhost:8080/New-FoodOrdering/orders/add",
        order
      );
      setMessage("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
      setMessage("Error submitting order.");
    }
  };

  return (
    <div className="order-container">
      {/* Order Form */}
      <div className="form-section">
        <h1>Place an Order</h1>
        <form onSubmit={handleOrderSubmit}>
          <label>
            Customer Name:
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit Order</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      {/* Food Menu Display */}
      <div className="food-menu">
        <h2>Our Menu</h2>
        <div className="food-items">
          {foodItems.map((item) => (
            <div key={item.id} className="food-card">
              <img src={item.image} alt={item.name} className="food-image" />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <button onClick={() => handleAddToOrder(item)}>
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Order;
