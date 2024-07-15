import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

export const useStudentSignUp = (payload, options = {}) => {
  return useMutation(async (userData) => {
    const { data } = await axiosInstance.post(
      "/v1/api/student/sign-up",
      userData
    );
    return data;
  }, {});
};
