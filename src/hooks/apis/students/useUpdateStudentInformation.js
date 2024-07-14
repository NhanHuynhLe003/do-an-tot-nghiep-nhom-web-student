import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { UserKeys } from "../../../constants/ReactQuery/user";

export const useUpdateStudentInformation = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (userData) => {
      const { data } = await axiosInstance.patch(
        `/v1/api/user/${userData.userId || ""}`,
        { ...userData }
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: [UserKeys.GET_STUDENT_INFORMATION_BY_USER_ID],
        });
      },

      ...options,
    }
  );
};
