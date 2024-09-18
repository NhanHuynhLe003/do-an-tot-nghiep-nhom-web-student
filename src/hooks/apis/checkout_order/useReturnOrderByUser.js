import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";
import { UserKeys } from "../../../constants/ReactQuery/user";

export const useReturnOrderByUser = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (orderData) => {
      const { data } = await axiosInstance.post(
        `/v1/api/checkout/order/return`,
        { ...orderData }
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        Promise.all([
          queryClient.invalidateQueries([UserKeys.GET_USER_BOOKS_READING]),
          queryClient.invalidateQueries([UserKeys.GET_USER_BOOKS_READED]),
        ]);
      },

      ...options,
    }
  );
};
