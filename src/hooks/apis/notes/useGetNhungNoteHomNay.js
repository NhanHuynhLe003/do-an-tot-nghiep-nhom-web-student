import axiosInstance from "../../../apis/axiosConfig";
import { CategoryKeys } from "../../../constants";
import { NoteKeys } from "../../../constants/ReactQuery/note";

import { QueryFunction } from "../queryGetFunction";

export const useGetNhungNoteHomNay = (payload = {}, options = {}) => {
  return QueryFunction(
    NoteKeys.GET_NHUNG_NOTE_HOM_NAY,
    async () =>
      await axiosInstance.get(`/v1/api/note/today/${payload.note_userId}?note_parentId=${payload.note_parentId}`, {
        body: payload
      })
  );
};
