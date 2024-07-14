import axiosInstance from "../../../apis/axiosConfig";
import { UserKeys } from "../../../constants/ReactQuery/user";
import { QueryFunction } from "../queryGetFunction";

export const useGetStudentReadedBooks = (payload = {}, options = {}) => {
  return QueryFunction(
    UserKeys.GET_USER_BOOKS_READED,
    async () =>
      await axiosInstance.get(`/v1/api/user/books-readed/${payload.userId}`, {
        ...payload,
      }),
    { enabled: !!payload.userId }
  );
};
