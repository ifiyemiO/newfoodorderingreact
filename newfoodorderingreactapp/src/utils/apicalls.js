// src/utils/apiCalls.js
import axios from "axios";

export const fetchMenuItems = async () => {
  const response = await axios.get("/menu_items");
  return response.data;
};

export const fetchOrders = async () => {
  const response = await axios.get("/orders");
  return response.data;
};

export const fetchRestaurants = async () => {
  const response = await axios.get("/restaurants");
  return response.data;
};
