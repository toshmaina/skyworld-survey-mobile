import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/xml",
    Accept: "application/xml",
    // Required for ngrok free tier — skips the browser warning interstitial
    // that ngrok shows for non-browser clients, which causes 403 responses
    "ngrok-skip-browser-warning": "true",
  },
});

// ── Request interceptor: attach JWT token to every request ──────────────────
client.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 globally ────────────────────────────────
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("jwt_token");
      await SecureStore.deleteItemAsync("user_data");
    }
    return Promise.reject(error);
  },
);

export default client;
