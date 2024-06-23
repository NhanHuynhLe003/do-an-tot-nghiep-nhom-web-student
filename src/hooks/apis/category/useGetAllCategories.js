import axiosInstance from "../../../apis/axiosConfig";
import { CategoryKeys } from "../../../constants";

import { QueryFunction } from "../queryGetFunction";

export const useGetAllCategories = (payload = {}, options = {}) => {
  return QueryFunction(
    CategoryKeys.GET_ALL_CATEGORIES,
    async () =>
      await axiosInstance.get("/v1/api/category/all", {
        ...payload,
      })
  );
};
