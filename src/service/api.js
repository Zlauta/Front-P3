// src/service/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // apunta a tu backend
});

export default API;
