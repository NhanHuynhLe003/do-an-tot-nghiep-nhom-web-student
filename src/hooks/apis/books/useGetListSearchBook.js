import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetListSearchBook = (payload = {}, options = {}) => {
  return QueryFunction(
    [
      BookKeys.GET_LIST_SEARCH_BOOK,
      payload?.sortType,
      payload?.categoryId,
      payload?.instockType,
      payload?.search,
      payload?.skip,
      payload?.limit,
    ],
    async () =>
      await axiosInstance.get(
        `/v1/api/book/filter?sortType=${payload.sortType || "all"}&categoryId=${
          payload.categoryId || "all"
        }&instockType=${payload.instockType || "all"}&search=${
          payload.search || ""
        }&skip=${payload.skip || 0}&limit=${payload.limit || 0}`,
        {
          ...payload,
        }
      )
  );
};
