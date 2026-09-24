import api from "./api.js";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  /**
   * Log in user with email and password
   */
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const data = response.data.data;

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  },

  /**
   * Register a new user
   */
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    const data = response.data.data;

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  },

  /**
   * Log out the current user and revoke token
   */
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Proceed with clearing local state even if server fails
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Fetch authenticated user details from API
   */
  async getMe() {
    const response = await api.get("/auth/me");
    const user = response.data.data;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Retrieve cached user from localStorage
   */
  getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Retrieve active token from localStorage
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Check if token exists
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};

export default authService;
