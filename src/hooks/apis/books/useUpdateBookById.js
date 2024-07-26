import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

export const useUpdateBookById = (payload = {}, options = {}) => {
  return useMutation(
    async (bodyPayload) => {
      const { data } = await axiosInstance.patch(
        `/v1/api/book/${bodyPayload?.id}`,
        bodyPayload
      );
      return data;
    },
    {
      ...options,
    }
  );
};
