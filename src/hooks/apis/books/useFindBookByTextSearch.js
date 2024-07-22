import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useFindBookByTextSearch = (payload = {}, options = {}) => {
  return QueryFunction(
    [BookKeys.FIND_BOOK_BY_TEXT_SEARCH, payload?.textSearch],
    async () =>
      await axiosInstance.get(`/v1/api/book/search/${payload?.textSearch}`, {
        ...options,
      }),
    {
      enabled: !!payload?.textSearch,
    }
  );
};
