import axios from "axios";
import {
  getRefreshToken,
  getToken,
  setAuthTokens,
  logout,
} from "../utils/auth"; // Import functions to manage tokens

const api = axios.create({
  baseURL: "http://206.189.228.234:8000", // Update if needed
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = getToken(); // Use the function to get access token
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

    // Handle token expiration (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken(); // Get the refresh token

        if (refreshToken) {
          // Make a request to the refresh endpoint to get a new access token
          const res = await axios.post("http://206.189.228.234:8000/refresh", {
            refresh_token: refreshToken,
          });

          // Store the new tokens in localStorage
          setAuthTokens(
            res.data.access_token,
            res.data.refresh_token,
            res.data.user
          );

          // Update the authorization header with the new access token
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access_token}`;

          // Retry the original request with the new access token
          return api(originalRequest);
        } else {
          // If no refresh token is found, log the user out
          logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh fails, log the user out
        logout();
        return Promise.reject(refreshError);
      }
    }

    // If the error is not due to an expired token, reject the promise
    return Promise.reject(error);
  }
);

export default api;
