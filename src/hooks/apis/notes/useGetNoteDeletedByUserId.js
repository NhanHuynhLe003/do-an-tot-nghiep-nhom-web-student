import axiosInstance from "../../../apis/axiosConfig";
import { NoteKeys } from "../../../constants/ReactQuery/note";
import { QueryFunction } from "../queryGetFunction";

export const useGetNoteDeletedByUserId = (payload = {}, options = {}) => {
  return QueryFunction(
    NoteKeys.GET_NOTE_DELETED_BY_USERID,
    async () =>
      await axiosInstance.get(`/v1/api/note/deleted/${payload?.userId}`, {
        ...payload,
      }),
    {
      enabled: !!payload?.userId,
    }
  );
};
