import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chattyv5.api.onrender.com/api/v1",
  withCredentials: true,
});
