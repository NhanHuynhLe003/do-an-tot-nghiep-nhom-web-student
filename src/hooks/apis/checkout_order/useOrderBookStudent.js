import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";

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
      ...options,
    }
  );
};
