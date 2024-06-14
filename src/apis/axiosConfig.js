import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/v1/api", // proxy sẽ chuyển hướng request này sang http://localhost:2024/v1/api
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
