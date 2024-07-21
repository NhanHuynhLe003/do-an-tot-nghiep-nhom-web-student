import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetBookPublishDetailById = (payload = {}, options = {}) => {
  return QueryFunction(
    [BookKeys.GET_BOOKS_BY_CATEGORY_ID, payload?.bookId],
    async () =>
      await axiosInstance.get(`/v1/api/book/publish/${payload?.bookId}`, {
        ...options,
      }),
    {
      enabled: !!payload?.bookId,
    }
  );
};
