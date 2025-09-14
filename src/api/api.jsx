import axios from "axios";
import {
  getRefreshToken,
  getToken,
  setAuthTokens,
  logout,
} from "../utils/auth";

const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1/auth",
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle expired token (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          // ✅ Use refresh endpoint
          const res = await axios.post(
            "https://api.escuelajs.co/api/v1/auth/refresh-token",
            {
              refreshToken, // 👈 correct key as per docs
            }
          );

          // Store new tokens
          setAuthTokens(
            res.data.access_token,
            res.data.refresh_token,
            res.data.user
          );

          // Update header
          api.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;

          // Retry original request
          return api(originalRequest);
        } else {
          logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
