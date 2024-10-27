import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { COMMENTKEYS } from "../../../constants/ReactQuery/comment";

export const useCreateComment = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (commentData) => {
      const { data } = await axiosInstance.post("/v1/api/comment", {
        ...commentData,
      });
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