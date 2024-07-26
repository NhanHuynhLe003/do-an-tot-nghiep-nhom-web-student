import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

export const useDeleteBookById = (payload = {}, options = {}) => {
  return useMutation(
    async (bodyPayload) => {
      const { data } = await axiosInstance.delete(
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
