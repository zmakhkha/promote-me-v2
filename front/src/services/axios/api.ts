import axios from "axios";
import { API_URL } from "@/utils/config";

// Create a mutable isAuth variable
let isAuth = !!localStorage.getItem("accessToken");

// Utility function to update isAuth
export const updateAuthStatus = () => {
  isAuth = !!localStorage.getItem("accessToken");
};

// Getter function to access current auth status
export const getIsAuth = () => isAuth;

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle auth error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");

      // Update isAuth on logout
      updateAuthStatus();

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
