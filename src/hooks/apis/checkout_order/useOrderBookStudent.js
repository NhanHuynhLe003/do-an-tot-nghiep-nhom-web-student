import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";
import { UserKeys } from "../../../constants/ReactQuery/user";

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
        queryClient.invalidateQueries({
          queryKey: [
            CheckoutOrderKeys.GET_ORDER_ALL,
            CheckoutOrderKeys.GET_ORDER_BY_STUDENT_ID,
            UserKeys.GET_USER_BOOKS_READING,
            UserKeys.GET_USER_BOOKS_READED,
          ],
        });
      },
    }
  );
};
