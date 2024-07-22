import axiosInstance from "../../../apis/axiosConfig";
import { UserKeys } from "../../../constants/ReactQuery/user";
import { QueryFunction } from "../queryGetFunction";

export const useListRankStudentBooksReaded = (payload = {}, options = {}) => {
  return QueryFunction(
    UserKeys.LIST_RANK_STUDENT_BOOKS_READED,
    async () =>
      await axiosInstance.get(`/v1/api/user/rank-student-readed-books`, {
        ...payload,
      })
  );
};
