import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

let onAuthFailure = null;

export const setOnAuthFailure = (callback) => {
  onAuthFailure = callback;
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (onAuthFailure) {
        onAuthFailure();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
