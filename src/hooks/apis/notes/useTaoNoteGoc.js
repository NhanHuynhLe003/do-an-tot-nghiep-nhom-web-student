import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";
import { NoteKeys } from "../../../constants/ReactQuery/note";

export const useTaoNoteGoc = (payload, options = {}) => {
  const queryClient = useQueryClient();

  // use Mutation cho các method còn lại là POST, PUT, DELETE,...., upload dữ liệu, tạo mới note, xóa note
  return useMutation(
    async (dulieunotegoc) => {
      const { data } = await axiosInstance.post(
        "/v1/api/note/create/origin",
        dulieunotegoc
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        // Gọi data mới về hiển thị
        queryClient.invalidateQueries({
          queryKey: [NoteKeys.GET_NHUNG_NOTE_HOM_NAY],
        });
      },

      ...options,
    }
  );
};
