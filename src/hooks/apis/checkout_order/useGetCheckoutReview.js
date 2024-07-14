import axiosInstance from "../../../apis/axiosConfig";
import { CheckoutOrderKeys } from "../../../constants";

import { QueryFunction } from "../queryGetFunction";

export const useGetCheckoutReview = (payload = {}, options = {}) => {
  return QueryFunction(
    CheckoutOrderKeys.GET_CHECKOUT_REVIEW,
    async () =>
      await axiosInstance.post("/v1/api/checkout/review", { ...payload })
  );
};
