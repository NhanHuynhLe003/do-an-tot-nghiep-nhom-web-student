import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CategoryKeys } from "../../../constants";

export const useCreateCategory = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (categoryPayload) => {
      const { data } = await axiosInstance.post(
        `/v1/api/category/create`,
        categoryPayload
      );
      return data;
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: [
            CategoryKeys.GET_ALL_CATEGORIES,
            CategoryKeys.GET_CATEGORIES_PUBLISHED,
          ],
        });
      },

      ...options,
    }
  );
};
