import axiosInstance from "../../../apis/axiosConfig";
import { BookKeys } from "../../../constants/ReactQuery/book";
import { QueryFunction } from "../queryGetFunction";

export const useGetAllBookNotDeletedByAdmin = (payload = {}, options = {}) => {
  return QueryFunction(
    [
      BookKeys.GET_ALL_BOOK_NOT_DELETED_BY_ADMIN,
      payload?.search,
      payload?.skip,
      payload?.limit,
    ],
    async () =>
      await axiosInstance.get(
        `/v1/api/book/admin/all?search=${payload?.search}&skip=${payload?.skip}&limit=${payload?.limit}`,
        {
          ...payload,
        }
      )
  );
};
