import axiosInstance from "../../../apis/axiosConfig";
import { CvKeys } from "../../../constants/ReactQuery/cv";
import { QueryFunction } from "../queryGetFunction";

export const useGetCvByIdAndUserId = (payload = {}, options = {}) => {
  return QueryFunction([CvKeys.GET_CV_BY_ID_AND_USER_ID], async () => {
    const { cvId, userId } = payload;
    return await axiosInstance.get(`/v1/api/cv/${cvId}?userId=${userId}`);
  });
};
