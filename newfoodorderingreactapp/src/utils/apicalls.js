// src/utils/apiCalls.js
import axios from "axios";
import { BASE_URL } from "./config";

export const fetchMenuItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/listAllMenuItems`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menuitems:", error);
    throw error;
  }
};
