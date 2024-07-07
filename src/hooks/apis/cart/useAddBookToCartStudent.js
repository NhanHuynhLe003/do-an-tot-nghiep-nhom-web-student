import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { CartKeys } from "../../../constants/ReactQuery";

export const useAddBookToCartStudent = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (cartData) => {
      const { data } = await axiosInstance.post("/v1/api/cart/add", cartData);
      return data;
    },

    {
      ...options,
      onSuccess: (data, variables, context) => {
        console.log("SUCCESSED::::", data);
        // Dùng để refetch lại dữ liệu GET_BOOKS_IN_CART sau khi thêm sách vào giỏ hàng thanh cong
        queryClient.invalidateQueries({
          queryKey: [CartKeys.GET_BOOKS_IN_CART, data?.metadata?.cart_userId],
        });
      },
    }
  );
};