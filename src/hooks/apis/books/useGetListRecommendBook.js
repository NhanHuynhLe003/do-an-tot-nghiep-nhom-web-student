import { useQuery } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetListRecommendBooks = (payload = {}, options = {}) => {
  return QueryFunction(BookKeys.GET_LIST_RECOMMEND_BOOK, async () => {
    return await axiosInstance.get("/v1/api/book/recommends", {
      ...payload,
    });
  });
};
