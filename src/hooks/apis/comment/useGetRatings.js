import axiosInstance from "../../../apis/axiosConfig";
import { COMMENTKEYS } from "../../../constants/ReactQuery/comment";

import { QueryFunction } from "../queryGetFunction";

export const useGetRatings = (payload = {}, options = {}) => {
  return QueryFunction(
    [COMMENTKEYS.GET_RATINGS, ...Object.values(payload)],
    async () =>
      await axiosInstance.get(
        `/v1/api/comment/ratings?bookId=${payload?.bookId}`
      ),
    {
      enabled: !!payload.bookId,
    }
  );
};
