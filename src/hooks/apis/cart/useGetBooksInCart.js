import axiosInstance from "../../../apis/axiosConfig";
import { CartKeys } from "../../../constants/ReactQuery";
import { QueryFunction } from "../queryGetFunction";

export const useGetBooksInCart = (payload = {}, options = {}) => {
  return QueryFunction(
    [CartKeys.GET_BOOKS_IN_CART, payload.cartUserId],
    async () =>
      await axiosInstance.get(`/v1/api/cart/${payload.cartUserId}`, {
        ...payload,
      }),
    {
      enabled: !!payload?.cartUserId,
      refetchOnMount: true, // Tải lại khi data có thay đổi, dùng để update Cart khi thêm sách vào giỏ hàng
    }
  );
};
