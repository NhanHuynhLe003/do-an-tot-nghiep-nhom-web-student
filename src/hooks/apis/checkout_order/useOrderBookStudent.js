import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";
import { UserKeys } from "../../../constants/ReactQuery/user";
import { CartKeys } from "../../../constants/ReactQuery";

export const useOrderBookStudent = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (cartData) => {
      const { data } = await axiosInstance.post(
        "/v1/api/checkout/order",
        cartData
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: [CheckoutOrderKeys.GET_ORDER_ALL],
          }),
          queryClient.invalidateQueries({
            queryKey: [CheckoutOrderKeys.GET_ORDER_BY_STUDENT_ID],
          }),
          queryClient.invalidateQueries({
            queryKey: [CartKeys.GET_BOOKS_IN_CART],
          }),
          queryClient.invalidateQueries({
            queryKey: [UserKeys.GET_USER_BOOKS_READING],
          }),
          queryClient.invalidateQueries({
            queryKey: [UserKeys.GET_USER_BOOKS_READED],
          }),
        ]);
      },
    }
  );
};
