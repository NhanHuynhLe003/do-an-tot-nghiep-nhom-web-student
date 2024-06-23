import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetListSortBookReads = (payload = {}, options = {}) => {
  return QueryFunction(BookKeys.GET_LIST_SORT_READS, async () => {
    return await axiosInstance.get("/v1/api/book/sort/reads", {
      ...payload,
    });
  });
};
