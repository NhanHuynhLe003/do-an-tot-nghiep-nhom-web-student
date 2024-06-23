import { useQuery } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";

export const useGetListSortBookReads = (payload = {}, options = {}) => {
  return useQuery({
    queryKey: BookKeys.GET_LIST_SORT_READS,
    queryFn: async () => {
      return await axiosInstance.get("/v1/api/book/sort/reads", {
        ...payload,
      });
    },
  });
};
