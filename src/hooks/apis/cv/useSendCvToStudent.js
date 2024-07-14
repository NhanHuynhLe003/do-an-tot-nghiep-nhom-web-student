import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CvKeys } from "../../../constants/ReactQuery/cv";

export const useSendCvToStudent = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (cvData) => {
      const { data } = await axiosInstance.post(`/v1/api/cv/admin/send`, {
        ...cvData,
      });
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: [CvKeys.GET_CV_BY_ID, CvKeys.GET_ALL_CV_BY_ADMIN],
        });
      },

      ...options,
    }
  );
};
