import axiosInstance from "../../../apis/axiosConfig";
import { COMMENTKEYS } from "../../../constants/ReactQuery/comment";

import { QueryFunction } from "../queryGetFunction";

export const useGetComment = (payload = {}, options = {}) => {
  return QueryFunction(
    [COMMENTKEYS.GET_COMMENT, ...Object.values(payload)],
    async () =>
      await axiosInstance.get(
        `/v1/api/comment?bookId=${payload?.bookId}&parentCommentId=${
          payload?.parentCommentId || ""
        }&isRating=${payload?.isRating || false}&skip=${
          payload?.skip || 0
        }&limit=${payload?.limit || 0}`,
        { ...payload }
      ),
    {
      enabled: !!payload.bookId,
    }
  );
};
