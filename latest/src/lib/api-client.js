import axios from "axios";
import { HOST } from "../utils/constants.js";

// ✅ Create API Client
const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true, // Ensures cookies (if needed) are included
});

// ✅ Interceptor to attach token dynamically before every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Fetch User Info
export const getUserInfo = async () => {
  try {
    const response = await apiClient.get("/api/auth/user-info");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error.response?.data || error);
    throw error;
  }
};

// ✅ Update Profile
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/api/auth/update-profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error);
    throw error;
  }
};

// ✅ Search Contacts (Improved)
export const searchContacts = async (query) => {
  if (!query || typeof query !== "string" || query.trim() === "") {
    console.warn("Empty or invalid search query provided.");
    return [];
  }

  console.log("Searching contacts with query:", query);

  try {
    const response = await apiClient.post("/api/contacts/search", { query });
    console.log("Contacts fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error.response?.data || error);
    return [];
  }
};

// ✅ Export API Client
export default apiClient;
