import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";

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
        queryClient.invalidateQueries({
          queryKey: [CheckoutOrderKeys.GET_ORDER_ALL],
        });
      },

      ...options,
    }
  );
};
