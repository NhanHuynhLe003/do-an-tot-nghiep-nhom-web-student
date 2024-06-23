import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetListNewestBook = (payload = {}, options = {}) => {
  return QueryFunction(
    BookKeys.GET_LIST_NEWEST_BOOK,
    async () =>
      await axiosInstance.get("/v1/api/book/sort/newest", {
        ...payload,
      })
  );
};
