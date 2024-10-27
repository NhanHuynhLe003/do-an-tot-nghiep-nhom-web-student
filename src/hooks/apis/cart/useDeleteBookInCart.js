import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CartKeys } from "../../../constants/ReactQuery";
import { CheckoutOrderKeys } from "../../../constants";

export const useDeleteBookInCart = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (cartData) => {
      const { data } = await axiosInstance.delete("/v1/api/cart", {
        data: cartData, // Delete Axios không có data ở tham số thứ 2 nên phải truyền data vào trong config
      });
      return data;
    },

    {
      mutationKey: [
        CartKeys.DELETE_BOOK_IN_CART,
        payload?.bookId,
        payload?.userId,
      ],
      onSuccess: (data, variables, context) => {
        // Dùng để refetch lại dữ liệu GET_BOOKS_IN_CART sau khi XÓa sách khỏi giỏ hàng thanh cong

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
