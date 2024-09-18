import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CvKeys } from "../../../constants/ReactQuery/cv";

export const useUpdateCv = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (cvData) => {
      const { data } = await axiosInstance.put(`/v1/api/cv/`, { ...cvData });
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: [CvKeys.GET_CV_BY_ID],
          }),
          queryClient.invalidateQueries({
            queryKey: [CvKeys.GET_CVS_BY_USER_ID],
          }),
          queryClient.invalidateQueries({
            queryKey: [CvKeys.GET_ALL_CV_BY_ADMIN],
          }),
        ]);
      },

      ...options,
    }
  );
};
