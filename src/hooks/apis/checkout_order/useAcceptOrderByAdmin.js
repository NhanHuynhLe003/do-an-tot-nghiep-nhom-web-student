import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";
import { UserKeys } from "../../../constants/ReactQuery/user";

export const useAcceptOrderByAdmin = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (orderData) => {
      const { data } = await axiosInstance.post(
        `/v1/api/checkout/order/accept/${orderData.orderId}`
      );
      return data;
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: [
            CheckoutOrderKeys.GET_ORDER_ALL,
            CheckoutOrderKeys.GET_ORDER_BY_STUDENT_ID,
            UserKeys.GET_USER_BOOKS_READING,
            UserKeys.GET_USER_BOOKS_READED,
          ],
        });
      },

      ...options,
    }
  );
};
