import axiosInstance from "../../../apis/axiosConfig";
import { NoteKeys } from "../../../constants/ReactQuery/note";
import { QueryFunction } from "../queryGetFunction";

export const useGetAllNoteByUser = (payload = {}, options = {}) => {
  return QueryFunction(
    NoteKeys.GET_ALL_NOTE_BY_USERID,
    async () =>
      await axiosInstance.get(`/v1/api/note/user/${payload.userId}`, {
        ...payload,
      })
  );
};
