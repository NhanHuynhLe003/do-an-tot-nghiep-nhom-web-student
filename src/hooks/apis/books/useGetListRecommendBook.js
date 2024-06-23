import { useQuery } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";

export const useGetListRecommendBooks = (payload = {}, options = {}) => {
  return useQuery({
    queryKey: BookKeys.GET_LIST_RECOMMEND_BOOK,
    queryFn: async () => {
      return await axiosInstance.get("/v1/api/book/recommends", {
        ...payload,
      });
    },
  });
};
