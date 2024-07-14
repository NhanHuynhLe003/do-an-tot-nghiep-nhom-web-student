import axiosInstance from "../../../apis/axiosConfig";
import { UserKeys } from "../../../constants/ReactQuery/user";
import { QueryFunction } from "../queryGetFunction";

export const useGetStudentInformationByUserId = (
  payload = {},
  options = {}
) => {
  return QueryFunction(
    UserKeys.GET_STUDENT_INFORMATION_BY_USER_ID,
    async () =>
      await axiosInstance.get(`/v1/api/user/${payload.userId}`, {
        ...payload,
      }),
    { enabled: !!payload.userId }
  );
};
