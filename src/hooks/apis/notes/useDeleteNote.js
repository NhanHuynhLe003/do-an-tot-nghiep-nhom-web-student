import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { NoteKeys } from "../../../constants/ReactQuery/note";

export const useDeleteNote = (payload, options = {}) => {
  const queryClient = useQueryClient();

  // use Mutation cho các method còn lại là POST, PUT, DELETE,...., upload dữ liệu, tạo mới note, xóa note
  return useMutation(
    async (noteData) => {
      const { data } = await axiosInstance.delete(
        `/v1/api/note/${noteData.noteId}?note_userId=${noteData.userId}`
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        // Gọi data mới về hiển thị
        queryClient.invalidateQueries({
          queryKey: [NoteKeys.GET_NOTE_CHINH_CUA_USER],
        });
      },

      ...options,
    }
  );
};
