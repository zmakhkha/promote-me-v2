import axios from "axios";

export const API_URL = "http://127.0.0.1:2000/api/v1/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // This prevents sending cookies like CSRF token
});

// Add an interceptor to include the access token in every request
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("++++++++++++++++++++++++++++++++++++++++API error:", error);
    if (error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
