import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ ensures cookies travel
});

// ✅ Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No valid token found in cookies");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global 401 Redirect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);
