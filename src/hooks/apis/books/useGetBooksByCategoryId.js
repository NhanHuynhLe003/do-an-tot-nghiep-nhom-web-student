import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetBooksByCategoryId = (payload = {}, options = {}) => {
  const categoryId = payload.categoryId;
  return QueryFunction(
    BookKeys.GET_BOOKS_BY_CATEGORY_ID,
    async () =>
      await axiosInstance.get(`/v1/api/book/category/${categoryId}`, {
        ...options,
      })
  );
};
