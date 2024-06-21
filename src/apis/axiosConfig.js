import axios from "axios";
import { toast } from "react-toastify";

const API_KEY = `640dec9df23fbf3255079f3f7d375a9ea119dd0779a60538bf81b18aff28512ad44b4a911a78a53ead753401ad7eabbc0864472e10d4ae55667ddc6a3bedcafd`;
/*
  +---------------+      Request        +---------------+      Request      +---------------+        
  |               | ------------------> |               |-----------------> |               |
  |   Component   |                     |   Interceptor |                   |   API Server  |
  |               | <------------------ |               |<----------------- |               |
  +---------------+      Response       +---------------+      Response     +---------------+
                                                
*/
// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HOSTURL || "http://localhost:2024", // URL của API server
  headers: {
    "Content-Type": "application/json",
  },
});
const timeRequestTimeout = process.env.REACT_APP_TIME_OUT_REQUEST;

// Set thời gian timeout cho request
axiosInstance.defaults.timeout = timeRequestTimeout;

// Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    //====================Callback Xử lý trước khi request được gửi lên server=================
    // Đính kèm API_KEY vào header của request
    config.headers["x-api-key"] = API_KEY;

    const curAccessToken = localStorage.getItem("accessToken");
    const curRefreshToken = localStorage.getItem("refreshToken");
    const currentUser = localStorage.getItem("studentData");
    if (curAccessToken) {
      // Nếu tồn tại access token thì gán vào header Authorization
      config.headers["Authorization"] = `Bearer ${curAccessToken}`;
    }

    if (curRefreshToken) {
      // console.log("REFRESH TOKEN", curRefreshToken);
      // ngoại trừ login và signup thì tất cả các request đều cần đính kèm refresh token
      config.headers["x-rtoken-id"] = curRefreshToken;
    }

    console.log("CONFIG HEADER", config.headers);

    if (!!currentUser) {
      //Nếu có user thì gán vào header
      config.headers["x-client-id"] = JSON.parse(currentUser)._id;
    }

    return config;
  },
  (error) => {
    // Xử lý khi gặp lỗi request trước khi được gửi lên server
    const errorMessage = error.response?.data?.message || error?.message;
    console.error(errorMessage);
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý dữ liệu trả về từ server khi thành công

    return response;
  },
  (error) => {
    // Xử lý các lỗi chung như lỗi xác thực, tại đây có thể kết hợp react-toastify để hiển thị thông báo
    //Xử lý toàn bộ lỗi ở đây ngoại trừ lỗi 410(GONE - Sử dụng để xác thực token khi access token hết hạn, tiến hành refresh token)
    if (error.response?.status !== 410) {
      const errorMessage = error.response?.data?.message || error?.message;
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
