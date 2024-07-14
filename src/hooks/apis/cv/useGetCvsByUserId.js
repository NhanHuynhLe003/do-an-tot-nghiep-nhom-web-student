import axiosInstance from "../../../apis/axiosConfig";
import { CvKeys } from "../../../constants/ReactQuery/cv";
import { QueryFunction } from "../queryGetFunction";

export const useGetCvsByUserId = (payload = {}, options = {}) => {
  return QueryFunction(
    [CvKeys.GET_CVS_BY_USER_ID, payload?.skip, payload?.limit],
    async () => {
      const { userId } = payload;
      return await axiosInstance.get(
        `/v1/api/cv/list/${userId}?skip=${payload?.skip || 0}&limit=${
          payload.limit || 20
        }`
      );
    }
  );
};
