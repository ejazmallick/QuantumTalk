import { HOST } from "../utils/constants.js";
import axios from "axios";

const apiClient = axios.create({
  baseURL: HOST,
});

export default apiClient;