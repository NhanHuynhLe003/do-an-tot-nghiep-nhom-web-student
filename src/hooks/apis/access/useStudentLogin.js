import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

export const useStudentLogin = (payload, options = {}) => {
  return useMutation(
    async (userData) => {
      const { data } = await axiosInstance.post(
        "/v1/api/student/login",
        userData
      );
      return data;
    },
    {
      ...options,
    }
  );
};
