import { useQuery } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";

export const useGetListBooks = (payload = {}, options = {}) => {
  return useQuery({
    queryKey: BookKeys.GET_BOOK_PUBLISHS,
    queryFn: async () =>
      await axiosInstance.get("/v1/api/book/publishs", {
        ...payload,
      }),
  });
};
