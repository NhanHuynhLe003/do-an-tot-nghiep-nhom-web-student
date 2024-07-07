import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";

import { QueryFunction } from "../queryGetFunction";

export const useGetOrderByStudentId = (payload = {}, options = {}) => {
  return QueryFunction(
    CheckoutOrderKeys.GET_ORDER_BY_STUDENT_ID,
    async () =>
      await axiosInstance.get(
        `/v1/api/checkout/order/${payload.userId}?skip=${
          payload.skip || 0
        }&limit=${payload.limit || 0}`,
        { ...payload }
      ),
    {
      enabled: !!payload.userId,
    }
  );
};
