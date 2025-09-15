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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          // Refresh tokens
          const res = await axios.post(
            "https://api.escuelajs.co/api/v1/auth/refresh-token",
            { refreshToken }
          );

          const { access_token, refresh_token } = res.data;

          // ✅ Fetch user profile with new token
          const profileRes = await axios.get(
            "https://api.escuelajs.co/api/v1/auth/profile",
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );

          // Save everything
          setAuthTokens(access_token, refresh_token, profileRes.data);

          // Update header for future requests
          api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

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
