import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";
import { CvKeys } from "../../../constants/ReactQuery/cv";

export const useCreateEmptyCv = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const { data } = await axiosInstance.post(
        `http://localhost:2024/v1/api/cv`,
        {
          userId: payload.userId,
        }
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: [CvKeys.GET_ALL_CV_BY_ADMIN],
        });
      },

      ...options,
    }
  );
};
