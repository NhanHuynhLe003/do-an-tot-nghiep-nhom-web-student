import { useMutation } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

const useAdminCreateBook = (payload = {}, options = {}) => {
  return useMutation(
    async (bodyPayload) => {
      const { data } = await axiosInstance.post("/v1/api/book/", bodyPayload);
      return data;
    },
    {
      ...options,
    }
  );
};

export default useAdminCreateBook;
