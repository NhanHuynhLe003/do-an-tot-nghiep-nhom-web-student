import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { COMMENTKEYS } from "../../../constants/ReactQuery/comment";

export const useDeleteComment = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (commentId) => {
      const { data } = await axiosInstance.delete(
        `/v1/api/comment/${commentId}`
      );
      return data;
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: [COMMENTKEYS.GET_COMMENT],
        });
      },

      ...options,
    }
  );
};
