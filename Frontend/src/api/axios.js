import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

// Main API
const api = axios.create({
  baseURL: "https://localhost:7104/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Refresh API
const refreshApi = axios.create({
  baseURL: "https://localhost:7104/api",
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (
        originalRequest.url.includes("/Auth/login") ||
        originalRequest.url.includes("/Auth/refresh-token")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const authStore = useAuthStore();

      if (isRefreshing) {
        try {
          await refreshPromise;
          return retryRequest(originalRequest, authStore);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      refreshPromise = refreshAccessToken(authStore);

      try {
        await refreshPromise;

        return retryRequest(originalRequest, authStore);
      } catch (refreshError) {
        await authStore.logout();
        router.replace("/login");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    if (error.response?.status === 403) {
      router.replace("/unauthorized");
    }
    if(error.response?.status === 429) {
      const message = error.response.data?.message || "Too many requests. Please try again later.";
      console.warn(message);
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken(authStore) {
  const response = await refreshApi.post("/Auth/refresh-token");

  authStore.setAuth(response.data);

  return response.data;
}

function retryRequest(originalRequest, authStore) {
  originalRequest.headers.Authorization =
    `Bearer ${authStore.accessToken}`;

  return api(originalRequest);
}

export { refreshApi };

export default api;