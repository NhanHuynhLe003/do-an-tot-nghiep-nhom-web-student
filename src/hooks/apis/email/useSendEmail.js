import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

export const useSendEmail = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post(`/v1/api/email`, {
        destinationEmail: payload?.destinationEmail,
        nameReceiver: payload?.nameReceiver,
        title: payload?.title,
        content: payload?.content,
      });
      return data;
    },

    {
      onSuccess: (data, variables, context) => {},

      ...options,
    }
  );
};
