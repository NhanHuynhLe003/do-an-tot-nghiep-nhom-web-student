import { useQuery } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";

export const useGetListNewestBook = (payload = {}, options = {}) => {
  return useQuery({
    queryKey: BookKeys.GET_LIST_NEWEST_BOOK,
    queryFn: async () =>
      await axiosInstance.get("/v1/api/book/sort/newest", {
        ...payload,
      }),
  });
};
