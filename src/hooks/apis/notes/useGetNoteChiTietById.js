import axiosInstance from "../../../apis/axiosConfig";
import { NoteKeys } from "../../../constants/ReactQuery/note";

import { QueryFunction } from "../queryGetFunction";

export const useGetNoteChiTietById = (payload = {}, options = {}) => {
  // QUery function chỉ dùng cho GET, lấy dữ liệu về và hiển thị
  return QueryFunction(
    /*Khi các key có sự thay đổi thì sẽ gọi lại hàm lấy dữ liệu, nghĩa là ví dụ khi nhấn vào note
     chính có id:123 thì id note chính sẽ được gán cho payload.note_parentId và làm note_parentId thay đổi giá trị, hàm fetch sẽ được gọi lại*/
    [
      NoteKeys.GET_NOTE_CHI_TIET_BANG_ID, // key lấy note chính của USER
    ],
    async () => await axiosInstance.get(`/v1/api/note/${payload.noteId}`),
    {
      enabled: !!payload.noteId,
    }
  );
};
