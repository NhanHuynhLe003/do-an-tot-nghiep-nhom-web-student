import axiosInstance from "../../../apis/axiosConfig";
import { CategoryKeys } from "../../../constants";
import { QueryFunction } from "../queryGetFunction";

export const useGetCategoriesPublished = (payload = {}, options = {}) => {
  return QueryFunction(
    CategoryKeys.GET_CATEGORIES_PUBLISHED,
    async () =>
      await axiosInstance.get("/v1/api/category/published", {
        ...payload,
      })
  );
};
