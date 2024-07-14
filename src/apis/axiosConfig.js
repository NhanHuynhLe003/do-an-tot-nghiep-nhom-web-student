import axios from "axios";
import { toast } from "react-toastify";
import { useStudentLogout } from "../hooks/apis/access";




const API_KEY = `63bb4e06ac590361d931aca398956efdd3aeeedcd00956c458ca2d14b07f7b3e2dd84cea891fd912d1e24ad65b5ed9b47086a726cd0df8c73f812c828d3fe726`;

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

    if (!!currentUser) {
      //Nếu có user thì gán vào header
      config.headers["x-client-id"] = JSON.parse(currentUser)._id;
    }

    return config;
  },
  (error) => {
    // Xử lý khi gặp lỗi request trước khi được gửi lên server
    const errorMessage = error.response?.data?.message || error?.message;

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
  async (error) => {
    if (error.code === "ERR_NETWORK") return;
    // Xử lý các lỗi chung như lỗi xác thực, tại đây có thể kết hợp react-toastify để hiển thị thông báo

    if (error.response?.status === 401) {
      //Xử lý lỗi 401 Unauthorized
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2500,
        draggable: true,
      });
      await setTimeout(async () => {
        //gọi API logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("studentData");

        //Chuyển hướng về trang login
        window.location.reload();
        // window.location.href = "/login";
      }, 3000);
    } else if (error.response?.status === 410) {
      //Xử lý lỗi GONE (410) khi refresh token hết hạn
    } else {
      //Xử lý toàn bộ lỗi ở đây ngoại trừ lỗi 401
      const errorMessage = error.response?.data?.message || error?.message;
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
