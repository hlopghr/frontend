// frontend/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.141:5000/api", // backend URL
});

export default api;
