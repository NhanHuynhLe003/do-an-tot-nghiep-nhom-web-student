import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetListBooks = (payload = {}, options = {}) => {
  return QueryFunction(
    BookKeys.GET_BOOK_PUBLISHS,
    async () =>
      await axiosInstance.get("/v1/api/book/publishs", {
        ...payload,
      })
  );
};
