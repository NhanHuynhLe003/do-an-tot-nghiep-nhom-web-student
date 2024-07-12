import axiosInstance from "../../../apis/axiosConfig";
import { CvKeys } from "../../../constants/ReactQuery/cv";
import { QueryFunction } from "../queryGetFunction";

export const useGetAllCvByAdmin = (payload = {}, options = {}) => {
  return QueryFunction(
    [CvKeys.GET_ALL_CV_BY_ADMIN, payload.page, payload.pageSize],
    async () => {
      return await axiosInstance.get(
        `/v1/api/cv/admin/all?skip=${
          (payload.page - 1) * payload.pageSize
        }&limit=${payload.pageSize}`,
        {
          ...payload,
        }
      );
    }
  );
};
