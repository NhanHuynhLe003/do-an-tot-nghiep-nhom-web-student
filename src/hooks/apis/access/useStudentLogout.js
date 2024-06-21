import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

export const useStudentLogout = (payload, options = {}) => {
  return useMutation(
    async (bodyPayload) => {
      const { data } = await axiosInstance.post(
        "/v1/api/student/logout",
        bodyPayload
      );
      return data;
    },
    {
      ...options,
    }
  );
};
