import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://128.199.23.2:8089",
  headers: { "Content-Type": "application/json" },
});

export default instance;
