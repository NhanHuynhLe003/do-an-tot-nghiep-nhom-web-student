import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CartKeys } from "../../../constants/ReactQuery";
import { CheckoutOrderKeys } from "../../../constants";

export const useUpdateBookQuantiyInCart = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (cartData) => {
      const { data } = await axiosInstance.post(
        "/v1/api/cart/quantity",
        cartData
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        // Dùng để refetch lại dữ liệu GET_BOOKS_IN_CART sau khi chinh sửa số lượng sách vào giỏ hàng thanh cong
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: [CartKeys.GET_BOOKS_IN_CART],
          }),

          queryClient.invalidateQueries({
            queryKey: [CheckoutOrderKeys.GET_CHECKOUT_REVIEW],
          }),
        ]);
      },
      ...options,
    }
  );
};
