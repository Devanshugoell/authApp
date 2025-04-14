import axios from "axios";
import { getRefreshToken, logout } from "../utils/auth";

const api = axios.create({
  baseURL: "http://206.189.228.234:8000", // Update if needed
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();

        const res = await axios.post("http://206.189.228.234:8000/refresh", {
          refresh_token: refreshToken,
        });

        localStorage.setItem("access_token", res.data.access_token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
