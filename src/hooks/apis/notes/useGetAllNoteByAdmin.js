import axiosInstance from "../../../apis/axiosConfig";
import { NoteKeys } from "../../../constants/ReactQuery/note";
import { QueryFunction } from "../queryGetFunction";

export const useGetAllNoteByAdmin = (payload = {}, options = {}) => {
  return QueryFunction(
    [NoteKeys.GET_ALL_NOTE_BY_ADMIN, payload?.page, payload?.search],
    async () =>
      await axiosInstance.get(
        `/v1/api/note/admin/all?page=${payload?.page}&search=${payload?.search}`,
        {
          ...payload,
        }
      )
  );
};
