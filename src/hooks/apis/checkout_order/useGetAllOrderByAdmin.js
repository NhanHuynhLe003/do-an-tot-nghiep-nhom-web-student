import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";

import { QueryFunction } from "../queryGetFunction";

export const useGetAllOrderByAdmin = (
  payload = { skip: 0, limit: 0 },
  options = {}
) => {
  return QueryFunction(
    [CheckoutOrderKeys.GET_ORDER_ALL, payload], //Khi payload thay đổi thì query sẽ chạy lại
    async () => {
      const res = await axiosInstance.get(
        `/v1/api/checkout/order/all?skip=${payload.skip}&limit=${payload.limit}`,
        { ...payload }
      );

      return res;
    }
  );
};
