import axiosInstance from "../../../apis/axiosConfig";
import { UserKeys } from "../../../constants/ReactQuery/user";
import { QueryFunction } from "../queryGetFunction";

export const useGetAllStudentByAdmin = (payload = {}, options = {}) => {
  return QueryFunction(
    UserKeys.GET_ALL_STUDENT_BY_ADMIN,
    async () =>
      await axiosInstance.get(`/v1/api/user/admin/all`, {
        ...payload,
      })
  );
};
