import axiosInstance from "../../../apis/axiosConfig";
import { UserKeys } from "../../../constants/ReactQuery/user";
import { QueryFunction } from "../queryGetFunction";

export const useGetStudentReadingBooks = (payload = {}, options = {}) => {
  return QueryFunction(
    UserKeys.GET_USER_BOOKS_READING,
    async () =>
      await axiosInstance.get(`/v1/api/user/books-reading/${payload.userId}`, {
        ...payload,
      }),
    { enabled: !!payload.userId }
  );
};
