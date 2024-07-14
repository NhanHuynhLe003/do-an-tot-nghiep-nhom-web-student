import { useQuery } from "react-query";

/**
 *
 * @param {*} queryKey - Unique Key for query
 * @param {*} callbackQuery - Async Function for query
 * @param {*} options - options useQuery
 * @returns
 */
export const QueryFunction = (queryKey, callbackQuery, options = {}) => {
  return useQuery({
    queryKey: queryKey, //Unique key for query
    queryFn: callbackQuery, //Hàm async sẽ được gọi khi query được thực thi

    refetchOnWindowFocus: true, //Tải lại khi window focus, chuyển tab hoặc mở lại browser: true
    refetchOnReconnect: true, //Tải lại khi reconnect mạng: true
    refetchOnMount: true, //Tải lại khi component được mount: true
    retry: 1, //Số lần thử lại khi query thất bại: 1

    /*Stale Time: Infinity => Mô tả: Thời gian (tính bằng milliseconds) mà query sẽ được coi
    là "stale" (cũ). Infinity có nghĩa là query sẽ không bao giờ được coi là cũ và sẽ không 
    tự động refetch.*/
    staleTime: 1000 * 60, //5 minutes

    ...options,
  });
};
