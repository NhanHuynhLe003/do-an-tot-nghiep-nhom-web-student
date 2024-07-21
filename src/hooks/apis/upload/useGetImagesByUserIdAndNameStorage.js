import axiosInstance from "../../../apis/axiosConfig";
import { UploadKeys } from "../../../constants/ReactQuery/upload";
import { QueryFunction } from "../queryGetFunction";

export const useGetImagesByUserIdAndNameStorage = (
  payload = {},
  options = {}
) => {
  return QueryFunction(
    [UploadKeys.GET_IMAGES_BY_USER_ID_AND_NAME_STORAGE],
    async () =>
      await axiosInstance.get(
        `/v1/api/upload/img/user/${payload.userId}?nameStorage=${payload.nameStorage}`,
        {
          ...payload,
        }
      ),
    { enabled: !!payload.nameStorage && !!payload.userId }
  );
};
