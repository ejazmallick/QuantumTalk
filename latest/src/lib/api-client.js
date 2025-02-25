import { HOST } from "../utils/constants.js";
import axios from "axios";

const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});

export const getUserInfo = async () => {
  const response = await apiClient.get('/api/auth/user-info', {
    headers: {
      Authorization: `Bearer ${document.cookie.replace('jwt=', '')}`,
    },
  });
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.put('/api/auth/update-profile', profileData, {
    headers: {
      Authorization: `Bearer ${document.cookie.replace('jwt=', '')}`,
    },
  });
  return response.data;
};

export default apiClient;